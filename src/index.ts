import { ClientOptions, RepliesFiltter, Hash, PossibleErrorResponse } from './types';
import xmlrpc from 'xmlrpc';
import md5 from 'md5';

export default class SautoApi {
  private _client: xmlrpc.Client
  private _login: string
  private _password: string
  private _swKey: string
  private _sessionId: string | undefined

  constructor(config: ClientOptions, login: string, password: string, swKey: string) {
    this._client = xmlrpc.createClient(config)
    this._login = login
    this._password = password
    this._swKey = swKey;
    this._sessionId = undefined
  }

  private _checkLogin() {
    if (!this._sessionId) throw new Error('You must login before using API!')
  }

  private _sautoCall(functionName: string, args: any[]): Promise<any> {
    return new Promise((resolve, reject) =>
      this._client.methodCall(functionName, args, (err, res) => {
        if (err) reject(err.toString())
        if (res.status >= 400) reject(`(${res.status}) ${res.status_message}`)
        resolve(res)
      })
    )
  }

  private _getHash(): Promise<Hash> {
    return this._sautoCall('getHash', [this._login]).then(res => res.output)
  }

  async login(): Promise<Response> {
    const { hash_key, session_id } = await this._getHash()
    const hashedPassword = md5(md5(this._password) + hash_key)

    return new Promise((resolve, reject) =>
      this._client.methodCall('login', [session_id, hashedPassword, this._swKey], (err, res) => {
        if (err) reject(err.toString())
        if (res.status >= 400) reject(`(${res.status}) ${res.status_message}`)
        this._sessionId = session_id
        resolve(res)
      }))
  }

  version(): Promise<string> {
    return this._sautoCall('version', [])
      .then(res => res.output?.version)
  }

  logout(): Promise<PossibleErrorResponse> {
    this._checkLogin()
    return this._sautoCall('logout', [this._sessionId])
      .then(res => res.output)
  }

  addEditCar(carData: Object): Promise<any> {
    this._checkLogin()
    return this._sautoCall('addEditCar', [this._sessionId, carData])
      .then(res => res.output)
  }

  getCar(carId: number): Promise<any> {
    this._checkLogin()
    return this._sautoCall('getCar', [this._sessionId, carId])
      .then(res => res.output)
  }

  getCarId(customId: string): Promise<number> {
    this._checkLogin()
    return this._sautoCall('getCarId', [this._sessionId, customId])
      .then(res => res.output?.car_id)
  }

  delCar(carId: number): Promise<PossibleErrorResponse> {
    this._checkLogin()
    return this._sautoCall('delCar', [this._sessionId, carId])
      .then(res => res.output)
  }

  listOfCars(imported?: string): Promise<any[]> {
    this._checkLogin()
    return this._sautoCall('listOfCars', [this._sessionId, imported])
      .then(res => Object.values(res.output?.list_of_cars || {}))
  }

  topCars(carIds: number[]): Promise<PossibleErrorResponse> {
    this._checkLogin()
    return this._sautoCall('topCars', [this._sessionId, carIds])
      .then(res => res.output)
  }

  addEditPhoto(carId: number, photoData: Object): Promise<any> {
    this._checkLogin()
    return this._sautoCall('addEditPhoto', [this._sessionId, carId, photoData])
      .then(res => res.output)
  }

  delPhoto(photoId: number): Promise<PossibleErrorResponse> {
    this._checkLogin()
    return this._sautoCall('delPhoto', [this._sessionId, photoId])
      .then(res => res.output)
  }

  getPhotoId(carId: number, clientPhotoId: string): Promise<number> {
    this._checkLogin()
    return this._sautoCall('getPhotoId', [this._sessionId, carId, clientPhotoId])
      .then(res => res.output?.photo_id)
  }

  listOfPhotos(carId: number): Promise<any[]> {
    this._checkLogin()
    return this._sautoCall('listOfPhotos', [this._sessionId, carId])
      .then(res => Object.values(res.output?.list_of_photos || {}))
  }

  addEquipment(carId: number, equipment: number[]): Promise<any> {
    this._checkLogin()
    return this._sautoCall('addEquipment', [this._sessionId, carId, equipment])
      .then(res => res.output)
  }

  listOfEquipment(carId: number): Promise<any[]>  {
    this._checkLogin()
    return this._sautoCall('listOfEquipment', [this._sessionId, carId])
      .then(res => Object.values(res.output?.equipment || {}))
  }

  addVideo(carId: number, videoData: Object): Promise<any> {
    this._checkLogin()
    return this._sautoCall('addVideo', [this._sessionId, carId, videoData])
      .then(res => res.output)
  }

  delVideo(carId: number): Promise<PossibleErrorResponse> {
    this._checkLogin()
    return this._sautoCall('delVideo', [this._sessionId, carId])
      .then(res => res.output)
  }

  getReplies(filters: RepliesFiltter, offset: number, limit: number): Promise<any[]> {
    this._checkLogin()
    return this._sautoCall('getReplies', [this._sessionId, filters, offset, limit])
      .then(res => Object.values(res.output?.replies || {}))
  }
}
