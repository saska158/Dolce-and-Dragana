import { initializeApp } from "firebase/app"
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore"
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
}
  
export const fetchData = async (route) => {
  const category = routeToCollectionMap[`/${route}`]
  if (!category) {
    throw new Error(`No collection mapped for route: ${route}`)
  }
  try {
    const colRef = collection(db, category)
    const snapshot = await getDocs(colRef)
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return data
  } catch(error) {
    console.error("Error fetching items:", error)
  }
}


export async function getItem(route, id) {
  const category = routeToCollectionMap[`/${route}`]
  if (!category) {
    throw new Error(`No collection mapped for route: ${route}`)
  }
  try {
    const docRef = doc(db, category, id)
    const snapshot = await getDoc(docRef)
    return {
      ...snapshot.data(),
      id: snapshot.id
    }
  } catch(error) {
    console.error("Error fetching item:", error)
  }
}

export const addFavoriteItem = async (userId, item, category) => {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites')
    await addDoc(favoritesRef, {...item, category})
  } catch(error) {
    console.error("Error adding favorite item: ", error)
  }
}

export const removeFavoriteItem = async (userId, favoriteId) => {
  try {
    console.log('removed', favoriteId)
    const favoriteRef = doc(db, 'users', userId, 'favorites', favoriteId)
    await deleteDoc(favoriteRef)
  } catch (error) {
    console.error("Error removing favorite item: ", error)
  }
}

export const getFavoriteItems = (userId, callback) => {
  try {
    const favoritesCollectionRef = collection(db, 'users', userId, 'favorites')
    const unsubscribe = onSnapshot(favoritesCollectionRef, (snapshot) => {
      const favoriteItems = snapshot.docs.map(doc => ({uniqueId: doc.id, ...doc.data()}))
      callback(favoriteItems)
    }, (error) => {
      console.error("Error listening to updates: ", error)
    })
    return unsubscribe
  } catch (error) {
    console.error("Error fetching favorite items: ", error)
  }
}

export const addBillingAddress = async (userId, billingAddress) => {
  try {
    const billingAddressRef = collection(db, 'users', userId, 'billingAddress')
    await addDoc(billingAddressRef, billingAddress)
  } catch(error) {
    console.error("Error adding billing address", error)
  }
}

export const checkBillingAddress = async (userId) => {
  try {
    // Reference to the user's billing address subcollection
    const billingAddressCol = collection(db, 'users', userId, 'billingAddress')

    // Get all documents in the billingAddress subcollection
    const querySnapshot = await getDocs(billingAddressCol)
   // console.log('Query snapshot:', querySnapshot);
    //console.log('Documents:', querySnapshot.docs.map(doc => doc.data()));

    return !querySnapshot.empty
/*
    // Check if any documents exist
    if (!querySnapshot.empty) {
      // Billing address exists, navigate to route 1
      navigate('/route1')
    } else {
      // Billing address does not exist, navigate to route 2
      navigate('/route2')
    }*/
  } catch (error) {
    console.error('Error checking billing address:', error)
  }
}