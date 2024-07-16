import { useState, useEffect } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { fetchData } from "./api"
import ItemCard from "./ItemCard"


export default function ClothesGrid() {
  const [data, setData] = useState([])
  const { category } = useParams()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const [showColorDropdown, setShowColorDropdown] = useState(false)
  const [showSizeDropdown, setShowSizeDropdown] = useState(false)
  const [display, setDisplay] = useState(5)

  const [selectedItem, setSelectedItem] = useState(null)
  const [showSelectedItem, setShowSelectedItem] = useState(false)
  const [isItemFavourited, setIsItemFavourited] = useState(false)
  const [showFavouritedBox, setShowFavouritedBox] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)   
 
  const colorFilter = searchParams.get('color')
  const sizeFilter = searchParams.get('size')
    
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const data = await fetchData(category)
        //console.log(data)
        setLoading(true)
        setData(data)
      } catch(error) {
          //console.error(error)
          setError(error)
        } finally {
           setLoading(false)
          }
    }
    loadData()
  }, [category])

    
  function handleFilterChange(key, value) {
    setSearchParams(prevParams => {
      if(value === null) {
        prevParams.delete(key)
      } else {
          prevParams.set(key, value)
        }
    return prevParams
    })
  }

  function handleColorButton() {
    setShowColorDropdown(!showColorDropdown)
    setShowSizeDropdown(false)
  }

  function handleSizeButton() {
    setShowSizeDropdown(!showSizeDropdown)
    setShowColorDropdown(false)
  }

  const colors = data.map(item => item.color)
  const uniqueColors = [...new Set(colors)]
  const sizes = data.flatMap(item => item.sizes)
  const uniqueSizes = [...new Set(sizes)]

  const displayedItems = colorFilter ? data.filter(item => item.color === colorFilter) : data
  const itemsElements = displayedItems.map(item => <ItemCard 
                                                      category={category} 
                                                      item={item}
                                                      setShowSelectedItem={setShowSelectedItem}
                                                      setSelectedItem={setSelectedItem}
                                                      setIsItemFavourited={setIsItemFavourited}
                                                      setShowFavouritedBox={setShowFavouritedBox}
                                                      //setFavouritedItem={setFavouritedItem}
                                                      //setShowFavouritedItem={setShowFavouritedItem}
                                                   />)  

  if(loading) {
    return (
      <div className="content-container">
        <h1>Loading...</h1>
      </div>
    )
  }

  if(error) {
    return (
      <div className="content-container">
        <h1>{error.message}</h1>
      </div>
    )
  }

    return (
      <div className="content-container">
        <div className="display-options">
          <div className="filter-buttons">
            <button
              className={colorFilter === '' ? 'selected' : ''}
              onClick={() => handleFilterChange('color', null)}
            >
              VIEW ALL
            </button>
            <button 
              onClick={handleColorButton}
            >
              COLOR
            </button>
            <button 
              onClick={handleSizeButton}
            >
              SIZE
            </button>
            {
              showColorDropdown && (
                <div className="filter-table-options">
                  {
                    uniqueColors.map(color => (
                      <button
                        key={color}
                        className={colorFilter === color ? 'selected' : ''}
                        onClick={() => handleFilterChange('color', color)}
                      >
                        {color}
                      </button>
                    ))
                  }
                </div>
              )
            }
            {
              showSizeDropdown && (
                <div className="filter-table-options">
                  {
                    uniqueSizes.map(size => (
                      <button
                        key={size}
                        className={sizeFilter === size ? 'selected' : ''}
                        onClick={() => handleFilterChange('size', size)}
                      >
                        {size}
                      </button>
                    ))
                  }
                </div>
              )
            }
          </div>
          <div className="display-buttons">
            <div 
              className={`first-display-button ${display === 2 ? 'selected-display-button' : ''}`} 
              onClick={() => setDisplay(2)}
            >
            </div>
            <div 
              className={`second-display-button ${display === 5 ? 'selected-display-button' : ''}`} 
              onClick={() => setDisplay(5)}
            >
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
        
        <div 
          className={display === 5 ? "clothes-grid" : "clothes-grid-two-items"}
        >
          {itemsElements}
        </div>

        {
          showSelectedItem ? (
            <div className="selected-item-show">
              <button 
                onClick={() => setShowSelectedItem(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <p>SIZE {selectedItem.size} ADDED TO YOUR SHOPPING BAG</p>
              <div>
                <img src={selectedItem.images[0]} />
                <p>{selectedItem.name}</p>
              </div>
              <Link to='/shopping-bag'>SEE SHOPPING BAG</Link>
            </div>
            ) : null
          } 
          {
            showFavouritedBox ? 
              <div className="favourited-item-show">
                {
                  isItemFavourited ? (
                    <>
                      <p>Saved</p>
                      <Link to='/user-wishlist'>SEE LIST</Link>
                    </>
                  ) : (
                    <p>The item has been removed from favourites.</p>
                  )
                }
              </div> 
            : null
          }
      </div>
    )
}

/*
(
          <div className="favourited-item-show">
            <p>Saved</p>
            <Link to='/user-wishlist'>SEE LIST</Link>
          </div>
        ) : (
          <div className="favourited-item-show">
            <p>The item has been removed from favourites.</p>
          </div>
        )
*/