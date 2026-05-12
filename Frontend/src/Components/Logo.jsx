import logo from "../assets/logo.png";

const Logo = ({onClick}) => {
  return (
    <button
    onClick={onClick}
    className="group flex cursor-pointer items-center gap-2 border-0 bg-transparent"
  >
    <span className="font-display text-xl mt-4 font-bold tracking-tight text-black">
      <img width={"270"} src={logo} alt="" />
    </span>
  </button>
  )
}

export default Logo
