//Camille Norrito

import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

export async function allMaisons() {
    let records = await pb.collection('Maisons').getFullList();

    records = records.map((maison) => {
        maison.imgUrl = pb.files.getURL(maison, maison.images[0]);
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
    console.log("ici dans bySurface :", surface)
    const records = await pb.collection('Maisons').getFullList({
        filter: `surface >= ${surface}`
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

export async function addOffre(house) {
    try {
        await pb.collection('Maisons').create(house);
        return {
            success: true,
            message: 'Offre ajoutée avec succès'
        };
    } catch (error) {
        console.log('Une erreur est survenue en ajoutant la maison', error);
        return {
            success: false,
            message: 'Une erreur est survenue en ajoutant la maison'
        };
    }
}

export async function filterByPrix(prixMin, prixMax) {
    try {
        let data = await pb.collection('Maisons').getFullList({
            sort: '-created',
            filter: `prix >= ${prixMin} && prix <= ${prixMax}`
        });
        data = data.map((maison) => {
            maison.imgUrl = pb.files.getURL(maison, maison.images[0]);
            return maison;
        });
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en filtrant la liste des maisons', error);
        return [];
    }
}

export async function getAllAgents() {
    return await pb.collection("Agent").getFullList();
}

export async function getAgentById(id) {
    return await pb.collection("Agent").getOne(id);
}


export async function getOffresByAgent(agentEmail) {
    return await pb.collection("Maisons").getFullList({
        filter: `agent = "${agentEmail}"`,
    });
}

export async function setFavori(house) {
    try {
        const updatedHouse = await pb.collection("Maisons").update(house.id, {
            favori: !house.favori
        });
        console.log(`Favori mis à jour pour la maison : ${house.id}`);
        return updatedHouse;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du favori :", error);
    }
}
