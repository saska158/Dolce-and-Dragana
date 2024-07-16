import { useEffect, useState } from "react"
import { useAuth } from "./authContext"
import { getFavoriteItems } from "./api"
import ItemCard from "./ItemCard"
//import { onAuthStateChanged, getAuth } from "firebase/auth"

export default function User() {
    const { user } = useAuth()
    const [favorites, setFavorites] = useState([])

  /*  const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
        if(user) {
            console.log("User signed in:", user)
        } else {
            console.log("User signed out")
        }
    })*/

    useEffect(() => {
        const fetchFavorites = async () => {
            if(user) {
                const favoriteItems = await getFavoriteItems(user.uid)
                setFavorites(favoriteItems)
            }
        }
        fetchFavorites() //ne zaboravi da kolingujes
    }, [user])


    return (
        <div className="content-container">
            <p>personal details:</p><br />
            <p>{user.email}</p>
            <p>{user.displayName}</p><br />
            <p>favorites:</p><br />
            <div className="clothes-grid">
              {favorites.map(fav => <ItemCard key={fav.id} item={fav.item} />)}
            </div>
        </div>
    )
}