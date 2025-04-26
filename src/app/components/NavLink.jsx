const { default: Link } = require("next/link");

const NavLink = ({ href, title, id }) => {
	return (
		<Link
			href={href}
			className="block py-2 pl-3 pr-4 text-[#adb7be] sm:text-xl rounded md:p-0 hover:text-white"
			id={id} // Add id prop here
		>
			{title}
		</Link>
	);
};

export default NavLink;
