import "./PropertiesBar.css";

// let width = 500;

// setInterval(() => {
//     if (width === 500) {
//         width = 1000;
//     } else {
//         width = 500;
//     }
//     document.documentElement.style.setProperty("--properties-bar-width", width + "px");
// }, 2000);

type PropertiesBarProps = {
    // selection: Nullable<FlowElement>;
    // TODO: narrow type here
    children: any;
};

const PropertiesBar = ({ children }: PropertiesBarProps) => {
    return (
        <div id="PropertiesBar" className="absolute right-0 h-full w-[var(--properties-bar-width)] z-10 ease-in-out duration-300 divide-y divide-slate-200 divide-opacity-70 border-l border-l-slate-100">
            <p className="text-2xl font-semibold mx-20 my-4">
                Properties
            </p>
            {/* <p>
                {`Node: ${selection?.data?.label ?? "No selection"}`}
            </p>
            <p>
                {`Edge: ${selection?.data?.label ?? "No selection"}`}
            </p> */}
            {/* <Property /> */}
            {children}
        </div>
    )
};

export default PropertiesBar;