import { useMedia } from "use-media"

const useScreenWidth = () => {
    const isSmallScreen = useMedia({maxWidth: '768px'})
    return { isSmallScreen }
}

export default useScreenWidth