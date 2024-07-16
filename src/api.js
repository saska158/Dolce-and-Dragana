import { initializeApp } from "firebase/app"

import { 
    getFirestore, 
    collection, 
    doc, 
    getDocs, 
    getDoc,
    addDoc,
    deleteDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    query,
    where
} from "firebase/firestore/lite"
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDfeJ_a5u8G6LVrjw0vAxdVQEOpTRqQ9bE",
  authDomain: "dolceanddragana.firebaseapp.com",
  projectId: "dolceanddragana",
  storageBucket: "dolceanddragana.appspot.com",
  messagingSenderId: "677162276800",
  appId: "1:677162276800:web:91a8e9ed53b38cb856da25"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
export { auth }


const routeToCollectionMap = {
    '/women-jackets': 'women-jackets',
    '/women-blouses': 'women-blouses',
    '/women-sweaters': 'women-sweaters',
    '/women-coats': 'women-coats',
    '/men-jackets': 'men-jackets',
    '/men-shirts': 'men-shirts'
    // add more routes and corresponding collections as needed
  }
  
export const fetchData = async (route) => {
  const category = routeToCollectionMap[`/${route}`]
  if (!category) {
    throw new Error(`No collection mapped for route: ${route}`)
  }
  const colRef = collection(db, category)
  const snapshot = await getDocs(colRef)
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return data
}


export async function getItem(route, id) {
  const category = routeToCollectionMap[`/${route}`]
  if (!category) {
    throw new Error(`No collection mapped for route: ${route}`)
  }
  const docRef = doc(db, category, id)
  const snapshot = await getDoc(docRef)
  return {
      ...snapshot.data(),
      id: snapshot.id
  }
}


// Function to add favorite item
export const addFavoriteItem = async (userId, item) => {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    await addDoc(favoritesRef, { item });
  } catch (error) {
    console.error("Error adding favorite item: ", error);
  }
}

// Function to remove favorite item
export const removeFavoriteItem = async (userId, favoriteId) => {
  try {
    const favoriteRef = doc(db, 'users', userId, 'favorites', favoriteId);
    await deleteDoc(favoriteRef);
  } catch (error) {
    console.error("Error removing favorite item: ", error);
  }
};

// Function to get favorite items
export const getFavoriteItems = async (userId) => {
  const favoritesRef = collection(db, 'users', userId, 'favorites');
  const querySnapshot = await getDocs(favoritesRef);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};