import { model, Schema, Model, Document } from 'mongoose';

export interface ISession extends Document {
    userId: string,
    username: string,
    expiresAt: Date,
    token: string
}

const SessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

const Session: Model<ISession> = model('Session', SessionSchema);

export default Session