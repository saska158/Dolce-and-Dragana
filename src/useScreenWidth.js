import { useMedia } from "use-media"

const useScreenWidth = () => {
    const isSmallScreen = useMedia({maxWidth: '768px'})
    console.log(isSmallScreen)
    return { isSmallScreen }
}

export default useScreenWidth