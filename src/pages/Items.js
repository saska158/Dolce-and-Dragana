import { useState, useEffect, useRef } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { fetchData } from "../utils/api"
import ItemCard from "../components/ItemCard"
import gsap from "gsap"


const Items = () => {
  const [data, setData] = useState([])
  const [sortedItems, setSortedItems] = useState(data)
  const [showColorDropdown, setShowColorDropdown] = useState(false)
  const [showSizeDropdown, setShowSizeDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropDown] = useState(false)
  const [display, setDisplay] = useState(5)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showSelectedItem, setShowSelectedItem] = useState(false)
  const [isItemFavourited, setIsItemFavourited] = useState(false)
  const [showFavouritedBox, setShowFavouritedBox] = useState(false)

  const { category } = useParams()
  const [ searchParams, setSearchParams ] = useSearchParams()

  const itemsGridRef = useRef(null)
  const displayOptionsRef = useRef(null)
  const selectedItemRef = useRef(null)  
 
  const colorFilter = searchParams.get('color')
  const sizeFilter = searchParams.get('size')
  const sortOrder = searchParams.get('sortOrder')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false) 

  const colors = data.map(item => item.color)
  const uniqueColors = [...new Set(colors)]
  const sizes = data.flatMap(item => item.sizes)
  const uniqueSizes = [...new Set(sizes)]


 
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const data = await fetchData(category)
        setLoading(true)
        setData(data)
      } catch(error) {
          setError(error)
      } finally {
           setLoading(false)
      }
    }
    loadData()
  }, [category])

  useEffect(() => {
    let sortedData = [...data]
    if (sortOrder === 'asc') {
      sortedData.sort((a, b) => a.price - b.price)
    } else if (sortOrder === 'desc') {
      sortedData.sort((a, b) => b.price - a.price)
    }
    setSortedItems(sortedData);
  }, [sortOrder, data])

  useEffect(() => {
    gsap.to(displayOptionsRef.current, {duration: 0.7, y: 0, opacity: 1, ease: "power4.out" })
    gsap.to(itemsGridRef.current, {duration: 0.9, delay: 0.3, y: 0, opacity: 1, ease: "power4.out" })
  }, [data])

  useEffect(() => {
    if(showSelectedItem) {
      gsap.to(selectedItemRef.current, {duration: 0.7, x: 0, ease: "power4.out"})
    } else {
      gsap.to(selectedItemRef.current, {duration: 0.7, x: '100%', ease: "power4.in"})
    }
  }, [showSelectedItem])
    
  const handleFilterChange = (key, value) => {
    setSearchParams(prevParams => {
      if(value === null) {
        prevParams.delete(key)
      } else {
          prevParams.set(key, value)
        }
    return prevParams
    })
  }

  const handleSortChange = (order) => {
    setSearchParams(prevParams => {
      if (order === null) {
        prevParams.delete('sortOrder')
      } else {
        prevParams.set('sortOrder', order)
      }
      return prevParams
    })
  }

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams())
    setShowColorDropdown(false)
    setShowSizeDropdown(false)
    setShowSortDropDown(false)
  }

  const handleColorButton = () => {
    setShowColorDropdown(!showColorDropdown)
    setShowSizeDropdown(false)
    setShowSortDropDown(false)
  }

  const handleSizeButton = () => {
    setShowSizeDropdown(!showSizeDropdown)
    setShowColorDropdown(false)
    setShowSortDropDown(false)
  }

  const handleSortButton = () => {
    setShowSortDropDown(!showSortDropdown)
    setShowColorDropdown(false)
    setShowSizeDropdown(false)
  }
  
  const filteredItems = sortedItems.filter(item => {
    const matchesColor = colorFilter ? item.color === colorFilter : true
    const matchesSize = sizeFilter ? item.sizes.some(size => size === sizeFilter) : true
    return matchesColor && matchesSize
  })


  const itemsElements = filteredItems.length > 0 ? 
    (filteredItems.map(item => <ItemCard 
                                   category={category} 
                                   item={item}
                                   key={item.id}
                                   setShowSelectedItem={setShowSelectedItem}
                                   setSelectedItem={setSelectedItem}
                                   setIsItemFavourited={setIsItemFavourited}
                                   setShowFavouritedBox={setShowFavouritedBox}
                                 />)) : null  

  if(loading) {
    return (
      <div className="content-container">
        <p className="loader-and-error">Loading...</p>
      </div>
    )
  }

  if(error) {
    return (
      <div className="content-container">
        <p className="loader-and-error">{error.message}</p>
      </div>
    )
  }

  return (
    <>
      <div className="content-container" style={showSelectedItem ? {opacity: '.3'} : null}>
        <div className="display-options" ref={displayOptionsRef}>
          <div className="filter-buttons">
            <button
              className={colorFilter === '' ? 'selected' : ''}
              onClick={() => clearAllFilters()}
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
            <button
              onClick={handleSortButton}
            >
              SORT
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
            {
              showSortDropdown && (
                <div className="filter-table-options">
                  <button onClick={() => handleSortChange('asc')}>lowest to highest price</button>
                  <button onClick={() => handleSortChange('desc')}>highest to lowest price</button>
                  <button onClick={() => handleSortChange(null)}>clear sorting</button>
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
          ref={itemsGridRef}
        >
          {
            itemsElements ? itemsElements : <p>No item matches your requirements.</p>
          }
        </div>

        
      </div>
      {
        selectedItem && (
          <div className="selected-item-show" ref={selectedItemRef}> 
            <button 
              onClick={() => setShowSelectedItem(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <p>SIZE {selectedItem.size} ADDED TO YOUR SHOPPING BAG</p>
            <div>
              <img src={selectedItem.images[0]} alt="selected-image" />
              <p>{selectedItem.name}</p>
            </div>
            <Link to='/shopping-bag'>SEE SHOPPING BAG</Link>
          </div>
        )
      }
      {
        showFavouritedBox ? 
          <div className="favourited-item-show">
            {
              isItemFavourited ? (
                <>
                  <p>Saved</p>
                  <Link to='/shopping-bag/user-favorites'>SEE LIST</Link>
                </>
              ) : (
                <p>The item has been removed from favourites.</p>
              )
            }
          </div> 
        : null
      }
    </>
  )
}

export default Items
