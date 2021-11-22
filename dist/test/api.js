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
const index_1 = __importDefault(require("../src/index"));
const chai_1 = require("chai");
const car_1 = __importDefault(require("./data/car"));
const fs_1 = __importDefault(require("fs"));
const mocha_1 = require("mocha");
const login = 'import', password = 'test', swKey = 'testkey-571769', config = {
    "host": "import.sauto.cz",
    "port": 80,
    "path": "/RPC2"
};
const api = new index_1.default(config, login, password, swKey);
let car = car_1.default;
describe('Sauto API tests', function () {
    this.timeout(10000);
    describe('without login', () => {
        it('should print version', () => __awaiter(this, void 0, void 0, function* () {
            return api
                .version()
                .then((version) => {
                (0, chai_1.expect)(version).to.be.a('string');
            });
        }));
        it('should login and logout', () => __awaiter(this, void 0, void 0, function* () {
            yield api.login();
            return api.logout();
        }));
    });
    describe('logged', () => {
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            return api
                .login();
        }));
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            return api
                .logout();
        }));
        it('should get list of cars', () => __awaiter(this, void 0, void 0, function* () {
            return api
                .listOfCars()
                .then((ids) => {
                (0, chai_1.expect)(ids).to.be.instanceOf(Array);
            });
        }));
        // TODO: implement...
        describe('car manipulation', () => {
            let carId, equips = [3, 4, 6, 7, 8];
            (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
                return api
                    .addEditCar(car_1.default)
                    .then((result) => {
                    (0, chai_1.expect)(result.car_id).to.be.a('number');
                    carId = result.car_id;
                });
            }));
            (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
                return api
                    .delCar(carId);
            }));
            it('should get a car', () => __awaiter(this, void 0, void 0, function* () {
                return api
                    .getCar(carId)
                    .then((result) => {
                    (0, chai_1.expect)(result).to.be.an('Object');
                });
            }));
            it('should edit car', () => __awaiter(this, void 0, void 0, function* () {
                car.car_id = carId;
                return api
                    .addEditCar(car)
                    .then((result) => {
                    (0, chai_1.expect)(result.car_id).to.be.a('number');
                });
            }));
            it('should get car id', () => __awaiter(this, void 0, void 0, function* () {
                return api
                    .getCarId(car.custom_id)
                    .then((result) => {
                    (0, chai_1.expect)(result).to.be.equal(carId);
                });
            }));
            it('should add equipment', () => __awaiter(this, void 0, void 0, function* () {
                return api
                    .addEquipment(carId, equips);
            }));
            it('should get list of equipment', () => __awaiter(this, void 0, void 0, function* () {
                return api
                    .listOfEquipment(carId)
                    .then((result) => {
                    (0, chai_1.expect)(result).to.be.an('Array');
                });
            }));
            it('should insert new car with errors', () => __awaiter(this, void 0, void 0, function* () {
                delete car.vin;
                delete car.custom_id;
                delete car.kind_id;
                delete car.brand_id;
                delete car.model_id;
                delete car.manufacturer_id;
                return api
                    .addEditCar({})
                    .catch((err) => {
                    (0, chai_1.expect)(err).to.be.eql('(452) Atribut \'car_data\' je povinný');
                });
            }));
            describe('small photos manipulation', () => {
                const images = ['1.jpg', '2.jpg', '3.jpg'];
                it('should fail', () => __awaiter(this, void 0, void 0, function* () {
                    const photos = images.map((img, i) => {
                        const content = fs_1.default.readFileSync('./test/data/' + img);
                        const base64Image = Buffer.from(content).toString('base64');
                        return {
                            b64: Buffer.from(base64Image, 'base64'),
                            client_photo_id: img,
                            main: i + 1
                        };
                    });
                    return Promise.all(photos.map(photo => api
                        .addEditPhoto(carId, photo)
                        .catch((err) => {
                        (0, chai_1.expect)(err).to.eql('(412) Fotografie je v malém rozlišení');
                    })));
                }));
            });
            describe('photo manipulation', () => {
                const images = ['1_big.jpg', '2_big.jpg', '3_big.jpg'];
                (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
                    const photos = images.map((img, i) => {
                        const content = fs_1.default.readFileSync('./test/data/' + img);
                        const base64Image = Buffer.from(content).toString('base64');
                        return {
                            b64: Buffer.from(base64Image, 'base64'),
                            client_photo_id: img,
                            main: i + 1
                        };
                    });
                    yield api.addEditPhoto(carId, photos[0]);
                    yield api.addEditPhoto(carId, photos[1]);
                    return api.addEditPhoto(carId, photos[2]);
                }));
                it('should get list of photos', () => __awaiter(this, void 0, void 0, function* () {
                    return api
                        .listOfPhotos(carId)
                        .then((result) => {
                        (0, chai_1.expect)(result).to.be.an('Array');
                    });
                }));
                it('should get photo id', () => __awaiter(this, void 0, void 0, function* () {
                    return api
                        .getPhotoId(carId, images[0])
                        .then((result) => {
                        (0, chai_1.expect)(result).to.be.a('number');
                    });
                }));
                describe('delete photo', () => {
                    let photoId;
                    (0, mocha_1.before)('should get photo id', () => __awaiter(this, void 0, void 0, function* () {
                        return api
                            .getPhotoId(carId, images[0])
                            .then((result) => {
                            photoId = result;
                        });
                    }));
                    it('should delete photo', () => __awaiter(this, void 0, void 0, function* () {
                        return api
                            .delPhoto(photoId);
                    }));
                });
            });
            describe('replies', () => {
                it('should get replies', () => __awaiter(this, void 0, void 0, function* () {
                    return api.
                        getReplies({ car_id: carId }, 0, 0)
                        .then((result) => {
                        (0, chai_1.expect)(result).to.be.an('Array');
                    });
                }));
            });
        });
    });
});
//# sourceMappingURL=api.js.map