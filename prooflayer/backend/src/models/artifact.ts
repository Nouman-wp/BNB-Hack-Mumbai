import mongoose, { Document, Schema } from 'mongoose';

export interface IArtifact extends Document {
    title: string;
    description: string;
    url: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const artifactSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    userId: { type: String, required: true },
}, {
    timestamps: true,
});

export const Artifact = mongoose.model<IArtifact>('Artifact', artifactSchema);