import { Router } from 'express';
import { ArtifactController } from '../controllers/artifactController';

const artifactController = new ArtifactController();

export function setArtifactRoutes(app: Router) {
    app.post('/api/artifacts', artifactController.createArtifact);
    app.get('/api/artifacts', artifactController.getArtifacts);
    app.get('/api/artifacts/:id', artifactController.getArtifactById);
    app.put('/api/artifacts/:id', artifactController.updateArtifact);
    app.delete('/api/artifacts/:id', artifactController.deleteArtifact);
}