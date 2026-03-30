import { PacmanLoader } from "react-spinners"

const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <PacmanLoader color="#3b22f6" size={60} />
    </div>
  )
}

export default PageLoader
