import { Injectable } from '@nestjs/common';

@Injectable()
export class FirestoreService {
  constructor() {}

  // collectionPointer: db.collection('example').
  async insertJsonToCollection(
    collectionPointer: any,
    dataJson: any,
    id?: string,
  ) {
    dataJson = JSON.parse(JSON.stringify(dataJson));
    if (!id) {
      collectionPointer.doc().create(dataJson);
    } else {
      collectionPointer.doc(id).set(dataJson, { merge: true });
    }
  }

  async getAll(collectionPointer: any) {
    const listDocs = await collectionPointer.get();
    const res = listDocs.map((e: any) => e.data());
    return res;
  }

  async getOne(collectionPointer: any, id: string) {
    const res = collectionPointer.doc(id);
    return res.data();
  }

  async updateOne(collectionPointer: any, dataJson: any, id: string) {
    const res = collectionPointer.doc(id).update(dataJson);
    return res.data();
  }

  deleteDoc(collectionPointer: any, id: string) {
    collectionPointer.doc(id).delete();
    return;
  }
}
