"use strict";
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
const xmlrpc_1 = __importDefault(require("xmlrpc"));
const md5_1 = __importDefault(require("md5"));
class SautoApi {
    constructor(config, login, password, swKey) {
        this._client = xmlrpc_1.default.createClient(config);
        this._login = login;
        this._password = password;
        this._swKey = swKey;
        this._sessionId = undefined;
    }
    _checkLogin() {
        if (!this._sessionId)
            throw new Error('You must login before using API!');
    }
    _sautoCall(functionName, args) {
        return new Promise((resolve, reject) => this._client.methodCall(functionName, args, (err, res) => {
            if (err)
                reject(err.toString());
            if (res.status >= 400)
                reject(`(${res.status}) ${res.status_message}`);
            resolve(res);
        }));
    }
    _getHash() {
        return this._sautoCall('getHash', [this._login]).then(res => res.output);
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            const { hash_key, session_id } = yield this._getHash();
            const hashedPassword = (0, md5_1.default)((0, md5_1.default)(this._password) + hash_key);
            return new Promise((resolve, reject) => this._client.methodCall('login', [session_id, hashedPassword, this._swKey], (err, res) => {
                if (err)
                    reject(err.toString());
                if (res.status >= 400)
                    reject(`(${res.status}) ${res.status_message}`);
                this._sessionId = session_id;
                resolve(res);
            }));
        });
    }
    version() {
        return this._sautoCall('version', [])
            .then(res => { var _a; return (_a = res.output) === null || _a === void 0 ? void 0 : _a.version; });
    }
    logout() {
        this._checkLogin();
        return this._sautoCall('logout', [this._sessionId])
            .then(res => res.output);
    }
    addEditCar(carData) {
        this._checkLogin();
        return this._sautoCall('addEditCar', [this._sessionId, carData])
            .then(res => res.output);
    }
    getCar(carId) {
        this._checkLogin();
        return this._sautoCall('getCar', [this._sessionId, carId])
            .then(res => res.output);
    }
    getCarId(customId) {
        this._checkLogin();
        return this._sautoCall('getCarId', [this._sessionId, customId])
            .then(res => { var _a; return (_a = res.output) === null || _a === void 0 ? void 0 : _a.car_id; });
    }
    delCar(carId) {
        this._checkLogin();
        return this._sautoCall('delCar', [this._sessionId, carId])
            .then(res => res.output);
    }
    listOfCars(imported) {
        this._checkLogin();
        return this._sautoCall('listOfCars', [this._sessionId, imported])
            .then(res => { var _a; return Object.values(((_a = res.output) === null || _a === void 0 ? void 0 : _a.list_of_cars) || {}); });
    }
    topCars(carIds) {
        this._checkLogin();
        return this._sautoCall('topCars', [this._sessionId, carIds])
            .then(res => res.output);
    }
    addEditPhoto(carId, photoData) {
        this._checkLogin();
        return this._sautoCall('addEditPhoto', [this._sessionId, carId, photoData])
            .then(res => res.output);
    }
    delPhoto(photoId) {
        this._checkLogin();
        return this._sautoCall('delPhoto', [this._sessionId, photoId])
            .then(res => res.output);
    }
    getPhotoId(carId, clientPhotoId) {
        this._checkLogin();
        return this._sautoCall('getPhotoId', [this._sessionId, carId, clientPhotoId])
            .then(res => { var _a; return (_a = res.output) === null || _a === void 0 ? void 0 : _a.photo_id; });
    }
    listOfPhotos(carId) {
        this._checkLogin();
        return this._sautoCall('listOfPhotos', [this._sessionId, carId])
            .then(res => { var _a; return Object.values(((_a = res.output) === null || _a === void 0 ? void 0 : _a.list_of_photos) || {}); });
    }
    addEquipment(carId, equipment) {
        this._checkLogin();
        return this._sautoCall('addEquipment', [this._sessionId, carId, equipment])
            .then(res => res.output);
    }
    listOfEquipment(carId) {
        this._checkLogin();
        return this._sautoCall('listOfEquipment', [this._sessionId, carId])
            .then(res => { var _a; return Object.values(((_a = res.output) === null || _a === void 0 ? void 0 : _a.equipment) || {}); });
    }
    addVideo(carId, videoData) {
        this._checkLogin();
        return this._sautoCall('addVideo', [this._sessionId, carId, videoData])
            .then(res => res.output);
    }
    delVideo(carId) {
        this._checkLogin();
        return this._sautoCall('delVideo', [this._sessionId, carId])
            .then(res => res.output);
    }
    getReplies(filters, offset, limit) {
        this._checkLogin();
        return this._sautoCall('getReplies', [this._sessionId, filters, offset, limit])
            .then(res => { var _a; return Object.values(((_a = res.output) === null || _a === void 0 ? void 0 : _a.replies) || {}); });
    }
}
exports.default = SautoApi;
//# sourceMappingURL=index.js.map