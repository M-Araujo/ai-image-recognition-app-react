// FaceRecognition.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as faceapi from '@vladmandic/face-api';

// 1) Mock before importing your component
vi.mock('@vladmandic/face-api', () => ({
    nets: {
        tinyFaceDetector: { loadFromUri: vi.fn().mockResolvedValue(undefined) },
    },
    detectAllFaces: vi.fn(),          // ← call vi.fn()
    resizeResults: vi.fn((r) => r),
    draw: { drawDetections: vi.fn() },
    TinyFaceDetectorOptions: vi.fn(),
}));

import FaceRecognition from '../../src/components/FaceRecognition';

describe('<FaceRecognition/>', () => {
    beforeEach(() => {
        // clear all mocks
        vi.clearAllMocks();
        // default to no faces
        faceapi.detectAllFaces.mockResolvedValue([]);
    });

    it('should show no faces detected when api returns empty', async () => {
        render(<FaceRecognition />);

        // upload a fake PNG
        const fileInput = screen.getByTestId('file-input');
        const fakeFile = new File(['dummy'], 'a.png', { type: 'image/png' });
        await userEvent.upload(fileInput, fakeFile);

        // simulate the image load event
        const img = await screen.findByAltText('Uploaded preview');
        fireEvent.load(img);

        // wait for the spinner to go away
        await waitFor(() =>
            expect(screen.queryByText(/Detecting Faces…/i)).not.toBeInTheDocument()
        );

        // assert the "no faces" message appears
        expect(screen.getByText(/No Faces Detected/i)).toBeVisible();
    });

    it('should show one face detected when api returns one value', async () => {
        faceapi.detectAllFaces.mockResolvedValueOnce([{}]);

        render(<FaceRecognition />);
        // upload a fake PNG
        const fileInput = screen.getByTestId('file-input');
        const fakeFile = new File(['dummy'], 'a.png', { type: 'image/png' });
        await userEvent.upload(fileInput, fakeFile);

        const img = await screen.findByAltText('Uploaded preview');
        fireEvent.load(img);

        // wait for the spinner to go away
        await waitFor(() =>
            expect(screen.queryByText(/Detecting Faces…/i)).not.toBeInTheDocument()
        );

        expect(screen.getByText(/Detected Faces: 1/i)).toBeVisible();
    });

    it('should show two faces detected when api returns two values', async () => {
        faceapi.detectAllFaces.mockResolvedValueOnce([{}, {}]);
        render(<FaceRecognition />);
        const fileInput = screen.getByTestId('file-input');
        const fakeFile = new File(['dummy'], 'a.png', { type: 'image/png' });
        await userEvent.upload(fileInput, fakeFile);

        const img = await screen.findByAltText('Uploaded preview');
        fireEvent.load(img);

        await waitFor(() =>
            expect(screen.queryByText(/Detecting Faces…/i)).not.toBeInTheDocument()
        );

        expect(screen.getByText(/Detected Faces: 2/i)).toBeVisible();
    });


    it('should show five faces detected when api returns five values', async () => {
        faceapi.detectAllFaces.mockResolvedValueOnce([{}, {}, {}, {}, {}]);
        render(<FaceRecognition />);
        const fileInput = screen.getByTestId('file-input');
        const fakeFile = new File(['dummy'], 'a.png', { type: 'image/png' });
        await userEvent.upload(fileInput, fakeFile);

        const img = await screen.findByAltText('Uploaded preview');
        fireEvent.load(img);

        await waitFor(() =>
            expect(screen.queryByText(/Detecting Faces…/i)).not.toBeInTheDocument()
        );
        expect(screen.getByText(/Detected Faces: 5/i)).toBeVisible();

    });

});
