import SautoApi from '../src/index';
import { expect } from 'chai';
import CAR from './data/car';
import fs from 'fs';
import { before, after } from 'mocha';

const login = 'import',
  password = 'test',
  swKey = 'testkey-571769',
  config = {
    "host": "import.sauto.cz",
    "port": 80,
    "path": "/RPC2"
  };

const api = new SautoApi(config, login, password, swKey);
let car = CAR as any

describe('Sauto API tests', function () {

  this.timeout(10000);


  describe('without login', () => {

    it('should print version', async () => api
      .version()
      .then((version) => {
        expect(version).to.be.a('string');
      }));


    it('should login and logout', async () => {

      await api.login();
      return api.logout();
    });

  });

  describe('logged', () => {

    before(async () => api
      .login());

    after(async () => api
      .logout());


    it('should get list of cars', async () => api
      .listOfCars()
      .then((ids) => {
        expect(ids).to.be.instanceOf(Array);
      }));


    // TODO: implement...
    describe('car manipulation', () => {

      let carId, equips = [3, 4, 6, 7, 8];

      before(async () => api
        .addEditCar(CAR)
        .then((result) => {
          expect(result.car_id).to.be.a('number');
          carId = result.car_id;
        }));


      after(async () => api
        .delCar(carId));


      it('should get a car', async () => api
        .getCar(carId)
        .then((result) => {
          expect(result).to.be.an('Object');
        }));


      it('should edit car', async () => {

        car.car_id = carId;

        return api
          .addEditCar(car)
          .then((result) => {
            expect(result.car_id).to.be.a('number');
          });
      });


      it('should get car id', async () => api
        .getCarId(car.custom_id)
        .then((result) => {
          expect(result).to.be.equal(carId);
        }));


      it('should add equipment', async () => api
        .addEquipment(carId, equips));


      it('should get list of equipment', async () => api
        .listOfEquipment(carId)
        .then((result) => {
          expect(result).to.be.an('Array');
        }));


      it('should insert new car with errors', async () => {

        delete car.vin;
        delete car.custom_id;
        delete car.kind_id;
        delete car.brand_id;
        delete car.model_id;
        delete car.manufacturer_id;

        return api
          .addEditCar({})
          .catch((err) => {
            expect(err).to.be.eql('(452) Atribut \'car_data\' je povinný');
          });
      });


      describe('small photos manipulation', () => {

        const images = ['1.jpg', '2.jpg', '3.jpg'];

        it('should fail', async () => {

          const photos = images.map((img, i) => {

            const content = fs.readFileSync('./test/data/' + img);

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
              expect(err).to.eql('(412) Fotografie je v malém rozlišení');
            })
          )
          );

        });

      });


      describe('photo manipulation', () => {

        const images = ['1_big.jpg', '2_big.jpg', '3_big.jpg'];

        before(async () => {

          const photos = images.map((img, i) => {

            const content = fs.readFileSync('./test/data/' + img);

            const base64Image = Buffer.from(content).toString('base64');

            return {
              b64: Buffer.from(base64Image, 'base64'),
              client_photo_id: img,
              main: i + 1
            };
          });

          await api.addEditPhoto(carId, photos[0])
          await api.addEditPhoto(carId, photos[1])         
          return api.addEditPhoto(carId, photos[2])
        });


        it('should get list of photos', async () => api
          .listOfPhotos(carId)
          .then((result) => {
            expect(result).to.be.an('Array');
          }));


        it('should get photo id', async () => api
          .getPhotoId(carId, images[0])
          .then((result) => {
            expect(result).to.be.a('number');
          }));


        describe('delete photo', () => {

          let photoId;

          before('should get photo id', async () => api
            .getPhotoId(carId, images[0])
            .then((result) => {
              photoId = result;
            }));


          it('should delete photo', async () => api
            .delPhoto(photoId));
        });
      });

      describe('replies', () => {

        it('should get replies', async () => 
          api.
          getReplies({car_id: carId}, 0, 0)
          .then((result) => {
          expect(result).to.be.an('Array');
        }));
      });
    });
  });
});
