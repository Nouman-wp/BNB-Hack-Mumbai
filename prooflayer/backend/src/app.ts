import express from 'express';
import mongoose from 'mongoose';
import { setArtifactRoutes } from './routes/artifactRoutes';
import { setAuthRoutes } from './routes/authRoutes';
import { setUserRoutes } from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prooflayer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

setArtifactRoutes(app);
setAuthRoutes(app);
setUserRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});