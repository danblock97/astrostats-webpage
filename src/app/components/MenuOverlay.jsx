import React from "react";
import NavLink from "./NavLink";

const MenuOverlay = ({ links }) => {
	return (
		<ul className="flex flex-col py-4 items-center">
			{links.map((link, index) => (
				<li key={index}>
					{link.id ? (
						// Render the "Report a Bug" button with the matching id for mobile.
						<button id={link.id} className="block py-2 pl-3 pr-4 text-[#adb7be] sm:text-xl rounded hover:text-white">
							{link.title}
						</button>
					) : (
						<NavLink href={link.path} title={link.title} />
					)}
				</li>
			))}
		</ul>
	);
};

export default MenuOverlay;
