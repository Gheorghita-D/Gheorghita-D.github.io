btn = document.querySelector('button')
section = document.querySelector("section")


var selectedEl = []

btn.addEventListener('click', (e) => {
    var task = document.createElement('li')
    var title = document.createElement('input')
    title.setAttribute('placeholder','task\'s title')
    title.style.height =  '30px'
    title.style.margin =  '5px'
    title.style.borderRadius = '5px'
    title.style.padding =  '5px'
    task.appendChild(title)
    document.getElementById("noCategory").appendChild(task)
    title.focus()

    task.setAttribute('draggable', 'true')
    addHandlers(task)

    title.addEventListener('keypress', (e) => {
        let key = e.which || e.keyCode
        if(key === 13){
            let name = document.createElement('span')
            name.innerHTML = e.target.value
            let strong = document.createElement('strong')
            strong.appendChild(name)

            var del = document.createElement('span')
            del.innerHTML = '&times;'
            addDelEv(del)


            var cb = document.createElement('input')
            cb.setAttribute("type", "checkbox")
            addCheckEv(cb)

            e.target.parentNode.insertBefore(del, e.target)
            e.target.parentNode.insertBefore(strong, del)
            e.target.parentNode.insertBefore(cb, strong)
            e.target.parentNode.removeChild(e.target)
        }
    })

})

function addCheckEv(cb){
    cb.addEventListener('change', (e) => {
        let fields = e.target.parentNode.childNodes
        if(e.target.checked){
            e.target.parentNode.style.backgroundColor = 'rgba(100, 200, 100, 0.5)'
            fields[1].style.opacity = 0.2
            fields[2].style.opacity = 0.3
        }else{
            e.target.parentNode.style.backgroundColor = 'rgba(200, 200, 200, 0.5)'
            fields[1].style.opacity = 1
            fields[2].style.opacity = 1
        }
    })
}

function addDelEv(del){
    del.addEventListener('click', (e) => {
                if(selectedEl.includes(e.target.parentNode)){
                    selectedEl = selectedEl.filter(function(value, index, arr){
                                    return value != e.target.parentNode;
                                });
                }
                e.target.parentNode.parentNode.removeChild(e.target.parentNode)
            })
}

function addHandlers(el){
    el.addEventListener( 'click', clickHandler)

    el.addEventListener('dragstart', dragStartHandler)

    el.addEventListener('dragover', dragOverHandler)
    el.addEventListener('dragleave', dragLeaveHandler)
    el.addEventListener('drop', dropHandler)
}


function clickHandler(e){
    if(e.ctrlKey){
        if(selectedEl.includes(this)){
            selectedEl = selectedEl.filter(function(value, index, arr){
                                return value != e.target;
                            });
            this.classList.remove('selected')
        }
        else{
            selectedEl[selectedEl.length] = this
            this.classList.add('selected')
        }
    }
}

function dragStartHandler(e){
    if(!e.target.classList.contains('selected')){
        for(var i=0; i<selectedEl.length; i++)
            selectedEl[i].classList.remove('selected')
        selectedEl = [e.target]
        e.target.style.opacity = '40%'
    }
    else
        for(i=0; i<selectedEl.length; i++)
                selectedEl[i].style.opacity = "40%"

}

function dragOverHandler(e) {
    if (e.preventDefault)
        e.preventDefault(); // Necessary. Allows us to drop.

    this.classList.add('over');

    return false;
}

function dragLeaveHandler(e) {
    this.classList.remove('over');
}


function dropHandler(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    this.classList.remove('over')

    var dropHTML = ''
    for(i=0; i<selectedEl.length; i++){
        dropHTML += selectedEl[i].outerHTML
    }
    this.insertAdjacentHTML('beforebegin',dropHTML);

    var dropElem = this.previousSibling;
    for(i=selectedEl.length-1; i>=0; i--){
        if(selectedEl[i].firstChild.checked)
            dropElem.firstChild.checked = true
        dropElem.style.opacity = '100%'
        dropElem.classList.remove('selected')
        addCheckEv(dropElem.firstChild)
        addDelEv(dropElem.lastChild)
        addHandlers(dropElem);
        
        dropElem = dropElem.previousSibling
    }


    for(i=0; i<selectedEl.length; i++)
        selectedEl[i].parentNode.removeChild(selectedEl[i])

    selectedEl = []

    return false;
}

section.addEventListener("dragover", overSection)
section.addEventListener("drop", dropOnSection)

function overSection(e){
    if (e.preventDefault)
        e.preventDefault(); // Necessary. Allows us to drop.

    return false;
}

document.querySelector('.close').addEventListener("click", (e)=>{
    document.querySelector(".modal").style.display = 'none'
})
document.querySelector('.newCategory').addEventListener('keypress', newCategoryHandler)

function dropOnSection(e){
    document.querySelector(".modal").style.display = 'block'
    document.querySelector('.newCategory').focus()
}

function newCategoryHandler(e){
    let key = e.which || e.keyCode
    if(key === 13){
        var div = document.createElement("div")
        div.classList.add('list')
        div.addEventListener("dragover", overList)
        div.addEventListener("drop", dropOnList)

        var label = document.createElement("label")
        label.setAttribute('for', e.target.value + document.querySelectorAll('.list').length)
        label.innerHTML = e.target.value

        var ul = document.createElement("ul")
        ul.setAttribute('id', e.target.value + document.querySelectorAll('.list').length)
        for(var i=0; i<selectedEl.length; i++){
            selectedEl[i].style.opacity = '100%'
            selectedEl[i].classList.remove('selected')
            ul.appendChild(selectedEl[i])
        }

        div.appendChild(label)
        div.appendChild(ul)
        document.querySelector('#lists').insertBefore(div, 
            document.querySelector('#lists').lastChild.previousSibling)

        selectedEl = []

        e.target.value = ''
        document.querySelector('.modal').style.display = 'none'

    }
}

document.querySelector('.list').addEventListener("dragover", overList)
document.querySelector('.list').addEventListener("drop", dropOnList)

function overList(e){
    if (e.preventDefault)
        e.preventDefault(); // Necessary. Allows us to drop.

    return false;
}

function dropOnList(e){
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    for(var i=0; i<selectedEl.length; i++){
        selectedEl[i].style.opacity = '100%'
        selectedEl[i].classList.remove('selected')
        this.lastChild.appendChild(selectedEl[i])
    }

    selectedEl = []
}