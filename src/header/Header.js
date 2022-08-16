import './Header.css';
function Header(subpage){

    return (
        <div className={"header " + ((subpage.subpage) ? "header_sm" : "")}>
            <h1 className="title header__title">Ålesund, Norway<br/> 2022-2023</h1>
        </div>
    );
}

export default Header;