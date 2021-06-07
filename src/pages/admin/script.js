const toggleDropDown = () => {
    const links = document.querySelectorAll('.dropdown-link')

    links.forEach(link => {
        link.classList.contains('hide') ? link.classList.remove('hide') : link.classList.add('hide')
    });
}

const setContainerOption = (optionContainer, linkId) => {
    const container = document.querySelector(optionContainer)
    const link = document.querySelector(linkId)
    const containers = document.querySelectorAll('.option-container')
    const optionLinks = document.querySelectorAll('.option-link')
    
    containers.forEach(container => {
        container.classList.add('hide')
    });
    
    optionLinks.forEach(container => {
        container.classList.remove('active')
    });
    
    if(container.classList.contains('hide') == true) {
        link.classList.add('active')
        container.classList.remove('hide')
    }
}

const toggleSidebar = () => {
    const sidebarContainer = document.querySelector('#sidebar-container')

    sidebarContainer.classList.contains('toggle-sidebar') ? sidebarContainer.classList.remove('toggle-sidebar') : sidebarContainer.classList.add('toggle-sidebar')
}