function showContent() {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = 1;
}

function setAnchorUnclicked(){
    const anchors = $('body').find('h1, h2, h3');
    // set everything inactive first
    for (var i = 0; i < anchors.length; i++){
        $('.stackedit__toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]').removeClass('stackedit-clicked');
    }
}

function setAnchorUnscrolled(){
    const anchors = $('body').find('h1, h2, h3');
    // set everything inactive first
    for (var i = 0; i < anchors.length; i++){
        $('.stackedit__toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]').removeClass('stackedit-scrolled');
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
    var currentTheme = localStorage.getItem('theme');
    
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
            var currentTheme = localStorage.getItem('theme');
            if (currentTheme == 'dark') {
                setButtonsTheme(toggleThemeButtons, 'light');
            } else {
                setButtonsTheme(toggleThemeButtons, 'dark');
            }
        }, 
        () => { //out
            const toggleThemeButtons = document.querySelectorAll('.toggle-theme');
            var currentTheme = localStorage.getItem('theme');
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
    var element_in_viewport = false;
    for (var i = 0; i < anchors.length ; i++){
        var heading_element = $('#' + $(anchors[i]).attr('id')); 
        if (heading_element.isInViewport()){
            element_in_viewport = true;
            break;
        }
    }

    if (element_in_viewport){
        var clicked_present = false;
        // check for clicked heading 
        for (var i = 0; i < anchors.length; i++){
            var toc_anchor = $('.stackedit__toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]');
            var heading_element = $('#' + $(anchors[i]).attr('id')); 
            
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
            for (var i = 0; i < anchors.length; i++){
                var toc_anchor = $('.stackedit__toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]');
                var heading_element = $('#' + $(anchors[i]).attr('id')); 
                
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
    for(var c = document.getElementsByTagName("a"), a = 0;a < c.length;a++) {
        var b = c[a];
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
    var links = document.getElementsByTagName("a");
    for (var eleLink=0; eleLink < links.length; eleLink ++) {
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
    // dom is fully loaded, but maybe waiting on images & css files
    setThemeToggle(); 
    showContent();

    // check device width
    handleDeviceChange(smallDevice);

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
