import { model, Schema, Document, Types } from 'mongoose';
import { AssignClassMethodsToSchemaStatics } from '../../helpers/AssignClassMethodsToSchemaStatics';
import { UsersFunctions } from './users.functions';
import { UsersDocumentInterface, UsersModelInterface } from './users.types';

const userSchema: Schema = new Schema({
    status: {
        type: Boolean,
        default: true,
    },
    firstName: String,
    lastName: String,
    fullName: String,
    username: String,
    image: String,
    email: String,
    active: Boolean,
    password: {
        type: String,
        select: false,
    },
    provider: String,
    google: {
        id: String,
        token: String
    },
    facebook: {
        id: String,
        token: String
    },
    phone: String,
    statusText: String,
    isVerified: Boolean,
    verificationPin: { type: Number, select: false },
    resetPasswordToken: String,
    profileCreated: Boolean,
    verifiedBadge: Boolean,
    customTitle: String,
    online: Boolean,
    tokens: {
        type: [String],
        select: false,
    },
    views: { type: Number, default: 0 },
    role: { type: Types.ObjectId, ref: 'Role' },
    is_deleted: Boolean,
    deleteReason: String
},
    { timestamps: true }
);

userSchema.index({ firstName: 'text', lastName: 'text' });

userSchema.pre('findOne', function () {
    this?.where({ is_deleted: { $ne: true } });
});

userSchema.pre('find', function () {
    this?.where({ is_deleted: { $ne: true } });
});

AssignClassMethodsToSchemaStatics(UsersFunctions, userSchema);

const userModel = model<UsersDocumentInterface, UsersModelInterface>('User', userSchema);

export default userModel;
