//Camille Norrito

import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

export async function allMaisons() {
    let records = await pb.collection('Maisons').getFullList();
    console.log("records all maison", records);

    records = records.map((maison) => {
        maison.imgUrl = pb.files.getURL(maison, maison.images[0]);
        console.log('maison on veut afficher url', maison.imgUrl)
        return maison;
    });
    return records;
}


export async function oneID(id) {
    const oneRecord = await pb.collection('Maisons').getOne(id);
    return oneRecord;
}

export async function allMaisonsFavori() {
    const records = await pb.collection('Maisons').getFullList({
        filter: 'favori = true'
    });
    return records;
}

export async function allMaisonsSorted() {
    const records = await pb.collection('Maisons').getFullList({
        sort: 'prix'
    });
    return records;
}

export async function bySurface(surface) {
    const records = await pb.collection('Maisons').getFullList({
        filter: `surface > ${surface}`
    });
    return records;
}

export async function surfaceORprice(surface, price) {
    const records = await pb.collection('Maisons').getFullList({
        filter: `surface > ${surface} || prix < ${price}`
    });
    return records;
}

export async function getAgentByID(id) {
    const agent = await pb.collection('agent').getOne(id);
    return agent;
}

export async function getOffre(id) {
    try {
        let data = await pb.collection('Maisons').getOne(id);
        data.imageUrl = pb.files.getURL(data, data.image);
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la maison', error);
        return null;
    }
}