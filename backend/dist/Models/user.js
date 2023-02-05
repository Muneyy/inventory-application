"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const friend_1 = __importDefault(require("./friend"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    handle: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        rqeuired: true,
    },
    bio: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    friends: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Friend',
        }],
    avatarURL: {
        type: String,
    },
}, { timestamps: true });
userSchema
    .virtual('url')
    .get(function () {
    return `/users/${this._id}`;
});
// Add a friend request to newly created users.
userSchema.post('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = this._id.toString();
        try {
            const docA = yield friend_1.default.findOneAndUpdate({ requester: "637f5e46a8d57dadbac5a76c", recipient: userId }, { $set: { status: 1 } }, { upsert: true, new: true });
            const docB = yield friend_1.default.findOneAndUpdate({ requester: userId, recipient: "637f5e46a8d57dadbac5a76c" }, { $set: { status: 2 } }, { upsert: true, new: true });
            const updateUserRequester = yield User.findOneAndUpdate({ _id: "637f5e46a8d57dadbac5a76c" }, { $push: { friends: docA._id } });
            const updateUserRecipient = yield User.findOneAndUpdate({ _id: userId }, { $push: { friends: docB._id } });
        }
        catch (err) {
            console.log(next);
            return next(err);
        }
    });
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
