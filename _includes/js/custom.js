function showContent() {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = 1;
}

function setAnchorUnclicked(){
    const anchors = $('body').find('h1, h2, h3');
    // set everything inactive first
    for (let i = 0; i < anchors.length; i++){
        $('.stackedit--toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]').removeClass('stackedit-clicked');
    }
}

function setAnchorUnscrolled(){
    const anchors = $('body').find('h1, h2, h3');
    // set everything inactive first
    for (let i = 0; i < anchors.length; i++){
        $('.stackedit--toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]').removeClass('stackedit-scrolled');
    }
}

function setTheme(){
    // User preset setup
    var currentTheme = localStorage.getItem('theme');
    if (currentTheme == 'dark') {
        jtd.setTheme('dark');
    } else {
        jtd.setTheme('light');
    }
}

function setButtonsTheme(elements, value){
    const classTheme = value === "light" ? "light-button" : "dark-button"
    const removeClassTheme = value === "light" ? "dark-button" : "light-button"
    for (const e of elements){
        e.classList.add(classTheme)
        e.classList.remove(removeClassTheme)
    }
}

function setClickEvent(elements){
    for (var i = 0; i<elements.length; i++){
        jtd.addEvent(elements[i], 'click', function(){
            if (jtd.getTheme() === 'dark') {
                jtd.setTheme('light');
                // set both buttons to be light
                setButtonsTheme(document.querySelectorAll('.toggle-theme'), 'light');
                localStorage.setItem('theme', 'light');
            } else {
                jtd.setTheme('dark');
                // set both buttons to be dark
                setButtonsTheme(document.querySelectorAll('.toggle-theme'), 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
}

function setThemeToggle(){ 
    // Set current state of the icon based on current theme   
    // Setup of buttons
    const toggleThemeButtons = document.querySelectorAll('.toggle-theme');
    let currentTheme = localStorage.getItem('theme');
    
    if (currentTheme == 'dark') {
        setButtonsTheme(toggleThemeButtons, 'dark');
    } else {
        setButtonsTheme(toggleThemeButtons, 'light');
    }

    // Setup toggle callback 
    setClickEvent(toggleThemeButtons);

    // Setup hover callback
    $(".toggle-theme").hover(
        () => { //hover
            const toggleThemeButtons = document.querySelectorAll('.toggle-theme');
            let currentTheme = localStorage.getItem('theme');
            if (currentTheme == 'dark') {
                setButtonsTheme(toggleThemeButtons, 'light');
            } else {
                setButtonsTheme(toggleThemeButtons, 'dark');
            }
        }, 
        () => { //out
            const toggleThemeButtons = document.querySelectorAll('.toggle-theme');
            let currentTheme = localStorage.getItem('theme');
            if (currentTheme == 'dark') {
                setButtonsTheme(toggleThemeButtons, 'dark');
            } else {
                setButtonsTheme(toggleThemeButtons, 'light');
            }
        }
        );
}

function highlightTocInView(){
    const anchors = $('body').find('h1, h2, h3');

    // find if any element is in the viewport
    let element_in_viewport = false;
    for (let i = 0; i < anchors.length ; i++){
        let heading_element = $('#' + $(anchors[i]).attr('id')); 
        if (heading_element.isInViewport()){
            element_in_viewport = true;
            break;
        }
    }

    if (element_in_viewport){
        let clicked_present = false;
        // check for clicked heading 
        for (let i = 0; i < anchors.length; i++){
            let toc_anchor = $('.stackedit--toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]');
            let heading_element = $('#' + $(anchors[i]).attr('id')); 
            
            // check if clicked
            if (toc_anchor.hasClass('stackedit-clicked')){
                // check if element is in viewport
                if (heading_element.isInViewport()){
                    // do nothing
                    clicked_present = true;
                    break;
                }
                else{
                    toc_anchor.removeClass('stackedit-clicked');
                }
            }
        }
        
        if (clicked_present == false){
            for (let i = 0; i < anchors.length; i++){
                let toc_anchor = $('.stackedit--toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]');
                let heading_element = $('#' + $(anchors[i]).attr('id')); 
                
                if (heading_element.isInViewport()){
                    // remove all class
                    setAnchorUnscrolled();
                    toc_anchor.addClass('stackedit-scrolled');
                    break;
                }
                else{
                    toc_anchor.removeClass('stackedit-scrolled');
                }

            }
        }
    }
    else{
        return;
    }
}


// ************************************************************* //
// Runs set theme first based on local storage, and load the CSS
setTheme();

//open external links in a new window
function external_new_window() {
    for(let c = document.getElementsByTagName("a"), a = 0;a < c.length;a++) {
        let b = c[a];
        if(b.getAttribute("href") && b.hostname !== location.hostname) {
            b.target = "_blank";
            b.rel = "noopener";
        }
    }
}

//open PDF links in a new window
function pdf_new_window ()
{
    if (!document.getElementsByTagName) return false;
    let links = document.getElementsByTagName("a");
    for (let eleLink=0; eleLink < links.length; eleLink ++) {
    if ((links[eleLink].href.indexOf('.pdf') !== -1)||(links[eleLink].href.indexOf('.doc') !== -1)||(links[eleLink].href.indexOf('.docx') !== -1)) {
        links[eleLink].onclick =
        function() {
            window.open(this.href);
            return false;
        }
    }
    }
} 

// Run scripts after DOM is loaded
window.addEventListener("DOMContentLoaded", (event) => {

    // Collapsible answers for quiz questions
    let coll = document.getElementsByClassName("collapsible");

    for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.display === "block") 
        {
            content.style.display = "none";
        } 
        else{
            content.style.display = "block";
        }
    });
    }

    // Toggle all collapsibles
    allCollapsibleToggle(coll);


    // dom is fully loaded, but maybe waiting on images & css files
    setThemeToggle(); 
    showContent();

    // check device width
    handleDeviceChange(smallDevice);

    // set mouse up listener
    setMouseUpListener();

    // open links in new tab
    pdf_new_window();
    external_new_window();
});


function handleDeviceChange(e) {
  if (e.matches){
    console.log("Bigger Than Mobile");
    jQuery(".aux-nav").detach().prependTo(".main-header")
    jQuery(".search").detach().prependTo(".main-header")
  }
  else {
    // detach the search bar
    // detach the hamburger
    console.log("Mobile");
    jQuery(".aux-nav").detach().appendTo(".site-header")
    jQuery(".search").detach().insertBefore(".side-bar")
  }
}

function setMouseUpListener(){
    let container = document.getElementById('site-nav');
    let main_header = document.getElementsByClassName('main-header')[0];
    let overlay = document.getElementsByClassName('search-overlay')[0];
    
    document.addEventListener('mouseup', function(e) {
        if (!container.contains(e.target) && container.classList.contains("nav-open")) {
            container.classList.remove("nav-open");
            main_header.classList.remove("nav-open");
            overlay.classList.remove('search-overlay-active');
            console.log("close sidebar");
        }
    });
}

function showContent() {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = 1;
}

function allCollapsibleToggle(collapsibles) {
    let btn = document.getElementsByClassName("btn-collapsible-toggle");
    for (let i = 0; i < btn.length; i++){
        btn[i].addEventListener("click", () => {
            for (let j = 0; j < collapsibles.length; j++) {
                collapsibles[j].classList.toggle("active");
                let content = collapsibles[j].nextElementSibling;
                if (content.style.display === "block") 
                {
                    content.style.display = "none";
                } 
                else{
                    content.style.display = "block";
                }
            };
        })
    }

}