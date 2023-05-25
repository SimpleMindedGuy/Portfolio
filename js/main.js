let files=[];
const list=[];
// let img=0;

document.documentElement.querySelectorAll(`.editable-ordered-list-container`).forEach((container)=>{

    const UnDragCont = typeof container.parentElement.parentElement.querySelector(".ordered-list-container") != 'undefined' ? container.parentElement.parentElement.querySelector(".ordered-list-container") : undefined

    

    container.addEventListener("dragover",(e)=>{
        e.preventDefault();
        const drag = container.querySelector(".dragging");
        if(drag != undefined){
            const afterElement = getDragAfterEelement(container,e.clientY).element;
            if(afterElement == null)
            {
                container.appendChild(drag)
            }
            else
            {
                container.insertBefore(drag,afterElement);
            }
            const children = [...container.querySelectorAll(".editable-ordered-list-element")]
            children.forEach((element,index)=>{
                element.querySelector(`.list-element-edit`).querySelector("p").innerHTML = `${index+UnDragCont.children.length}`
                element.querySelector(`.list-element-edit`).querySelector(`input`).value = index + UnDragCont.children.length
                element.querySelector(`.list-element-edit`).querySelector(`input`).checked = true
                console.log(element.querySelector(`input`).value)
                console.log("list")
                console.log(list)
            })
        }
        checkMSGs()
    })
})

document.documentElement.querySelectorAll(`.editable-ordered-list-element`).forEach(async(draggable) => {
    let beforedrag=[];
    

    await draggable.addEventListener("dragstart",(e)=>{
        draggable.classList.add("dragging")
        beforedrag = draggable.parentElement.querySelectorAll('input[type="checkbox"]')
        checkMSGs()
        console.log("list")
        console.log(list)
    })
    
    await draggable.addEventListener("dragend",(e)=>{
        draggable.classList.remove("dragging")
        draggable.parentElement.querySelectorAll('input[type="checkbox"]').forEach((element,index) => {
            if(element !=  beforedrag[index]){
                draggable.parentElement.parentElement.querySelector("#reset").checked=true;
            }
        });
        checkMSGs()
        console.log("list")
        console.log(list)
    })

    list.push(draggable)
})

async function resetEditableList()
{
    document.documentElement.querySelector(`.editable-ordered-list-container`).innerHTML =""
    list.forEach(element => {
        document.documentElement.querySelector(`.editable-ordered-list-container`).appendChild(element)
        console.log(element)
    });

    const container = document.documentElement.querySelector(`.editable-ordered-list-container`)
    const UnDragCont = typeof container.parentElement.parentElement.querySelector(".ordered-list-container") != 'undefined' ? container.parentElement.parentElement.querySelector(".ordered-list-container") : undefined

    const children = [...container.querySelectorAll(".editable-ordered-list-element")]
    children.forEach((element,index)=>{
        element.querySelector(`.list-element-edit`).querySelector("p").innerHTML = `${index+UnDragCont.children.length}`
        element.querySelector(`.list-element-edit`).querySelector(`input`).value = index + UnDragCont.children.length
        element.querySelector(`.list-element-edit`).querySelector(`input`).checked = true
    })
}

window.addEventListener("dragover",function(e)
{
    e = e || event;
    e.preventDefault();
    window.addEventListener("drop",function(e)
    {
        e = e || event;
        e.preventDefault();
    });

});

function ChangeTheme(Switch)
{
    if (Switch.checked) 
    {
        document.documentElement.setAttribute('dark','false');
        localStorage.setItem('Theme','light')
    }
    else
    {
        document.documentElement.setAttribute('dark','true');
        localStorage.setItem('Theme','dark')
    }
}

document.documentElement.querySelectorAll(`[type="file"]`).forEach(input => {
    input.value =""
    // console.log(input.files)
})


async function ShowHidePermissions()
{
    // console.log("check")
    document.documentElement.querySelector(`#permissions`).checked = true;
}

async function ShowHideUserGroups()
{
    // console.log("check")
    let checkboxes = document.documentElement.querySelectorAll(`input[name="Users"]`);
    let hide =true;
    console.log(document.documentElement.querySelector("#permissions"));
    for(let i = 0 ; i < checkboxes.length ;i++){
    
        if(checkboxes[i].checked == true)
        {
            hide = false;
            break
        }
    }
    if(hide == true)
    {
        document.documentElement.querySelector(".right-slide-tile").classList.remove("active");
        
    }
    else
    {
        document.documentElement.querySelector(`.right-slide-tile`).classList.add("active");
    }
    checkMSGs()

}


async function showSubmitButton()
{
    // console.log("check")
    let checkboxes = [...document.documentElement.querySelectorAll(`input[name="Users"]`)];
    for (let ele of [...document.documentElement.querySelectorAll(`input[name="Groups"]`)]){
        await checkboxes.push(ele)
    }
    
    let show =false;

    for(let i = 0 ; i < checkboxes.length ;i++){
    
        if(checkboxes[i].checked == true)
        {
            show = true;
            break
        }
    }
    if(show == true)
    {
        document.documentElement.querySelector(`input[id="reset"]`).checked = true;
    }
    else
    {
        document.documentElement.querySelector(`input[id="reset"]`).checked = false;
    }
    checkMSGs()

}

async function uncheckUserAndGroups()
{
    let checkboxes = [...document.documentElement.querySelectorAll(`input[name="Users"]`)];
    for (let ele of [...document.documentElement.querySelectorAll(`input[name="Groups"]`)]){
        await checkboxes.push(ele)
    }


    for(const cb of checkboxes){
        cb.checked = false;
    }
    checkMSGs()

}


async function ClearRadioSelection(){
    for( const Radio of document.documentElement.querySelectorAll("[name='groups']"))
    {
        Radio.checked=false;
    }
    // document.documentElement.querySelectorAll("[name='groups']")
}


function getDragAfterEelement(container , y)
{
    let elements = [...container.querySelectorAll('.editable-ordered-list-element:not(.dragging)')]

    return elements.reduce((closest,child)=>{
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if(offset < 0 && offset > closest.offset)
        {
            return({offset:offset,element : child})
        }
        else
        {
            return closest
        }
    },{offset: Number.NEGATIVE_INFINITY})
}


function ReadInputFiles(input)
{
    files=[...input.files]
    console.log(files)
}

function InputFiles(input)
{
    let dropzone =input.parentElement.querySelector(".dropzone")
    
    let newfiles = [...input.files]

    console.log(newfiles)

    let target = newfiles.length + files.length

    newfiles.forEach((file)=> 
    {
        if(file.type.indexOf("image") != -1)
        {
            // files.push(file);
            // console.log(file)
            ShowDropedFile(dropzone,file,target,input)
        }
        
    })


    // console.log(target)

    // SaveFilesDATA(dropzone , input , "add", target);
    
}

function DropFile(element , event)
{


    let dropzone = element.parentElement.parentElement.querySelector(".dropzone");
    let input =dropzone.parentElement.querySelector(`[type="file"]`);
    dropzone.classList.remove("drag");

    files=[...input.files]
    // console.log(input);

    // console.log(files)
    let newfiles = [...event.dataTransfer.files];

    let target = newfiles.length + files.length
    
    newfiles.forEach((file)=> 
    {
        if(file.type.indexOf("image") != -1)
        {
            // files.push(file);
            ShowDropedFile(dropzone,file,target,input)
        }
        
    })


}

function SaveFilesDATA(dropzone ,input , type , target)
{
    let FileData = new ClipboardEvent("").clipboardData || new DataTransfer();
    // console.log(files.length)
    console.log(target)
    console.log(files.length)
    console.log(files.length == target)

    if(type == "Add" && files.length === target)
    {
        files.forEach(file => {
            FileData.items.add(file);
        })
    }
    else if ( type == "Remove" || type == "remove")
    {
        // files.splice(target-1,1);
        files.splice(target, 1)
        files.forEach(file => {
            FileData.items.add(file);
        })
    } else if ( type == "Set" || type == "set")
    {
        FileData.items.add(files[files.length-1])
    }

    // console.log(files)
    
    input.files= FileData.files
    console.log(input.files)
    // files =[]
    // files=[];
}


function ActiveDropZone(element)
{
    element.parentElement.parentElement.querySelector(".dropzone").classList.add("drag");
}

function DeActiveDropZone(element)
{
    element.parentElement.parentElement.querySelector(".dropzone").classList.remove("drag");
}

function ShowDropedFile(dropzone,file,target,input)

{
    dropzone.classList.add("active")
    const reader = new FileReader();
    let textarea = dropzone.parentElement.querySelector(".post-input")
    reader.readAsDataURL(file);
    if(dropzone.classList.contains("one") )
    {
        reader.onload = ()=>
        {
            dropzone.innerHTML=`
            <div class="image">
                <img src="${reader.result}" alt="">
                <div class="image-blur">
                    <div class="cover"></div>

                    <div class="upload-remove" onclick="RemoveFile(this)">
                        <div class="x-line1"></div>
                        <div class="x-line2"></div>
                    </div>


                </div>
            </div>`;
            files.push(file);
            console.log("testing ",dropzone)

            SaveFilesDATA(dropzone , input , "Set", target);
        }
        console.log(file)

    }
    else if(dropzone.classList.contains("single")){

        if(dropzone.classList.contains("removeimage"))
        {
            dropzone.parentElement.querySelector("#removeimage").checked=false;
            reader.onload = ()=>
            {
                dropzone.innerHTML=`
                <div class="image">
                    <img src="${reader.result}" alt="">
                    <div class="image-blur">
                        <div class="cover"></div>

                        <label class="upload-remove" onclick="RemoveFile(this)" for="removeimage">
                            <div class="x-line1"></div>
                            <div class="x-line2"></div>
                        </label>


                    </div>
                </div>`;
                files.push(file);
                console.log("testing ",dropzone)

                SaveFilesDATA(dropzone , input , "Set", target);
            }
        }
        else
        {
            reader.onload = ()=>
            {
                dropzone.innerHTML=`
                <div class="image">
                    <img src="${reader.result}" alt="">
                    <div class="image-blur">
                        <div class="cover"></div>

                        <div class="upload-remove" onclick="RemoveFile(this)">
                            <div class="x-line1"></div>
                            <div class="x-line2"></div>
                        </div>


                    </div>
                </div>`;
                files.push(file);
                console.log("testing ",dropzone)

                SaveFilesDATA(dropzone , input , "Set", target);
            }
        }
        
        console.log(file)
        
    }
    else if(dropzone.classList.contains("icon")){
        reader.onload = ()=>
        {
            dropzone.innerHTML=`
            <div class="image">
                <img src="${reader.result}" alt="" onclick="RemoveFile(this)">

            </div>`;
            files.push(file);
            console.log("testing ",dropzone)

            SaveFilesDATA(dropzone , input , "Set", target);
        }
        console.log(file)
    }
    else
    {
        reader.onload = ()=>
        {
            dropzone.innerHTML+=`
            <div class="image">
                <img src="${reader.result}" alt="">
                <div class="image-blur">
                    <div class="cover"></div>

                    <div class="upload-remove" onclick="RemoveFile(this)">
                        <div class="x-line1"></div>
                        <div class="x-line2"></div>
                    </div>


                </div>
            </div>`;
            files.push(file);
            // console.log(files)
            console.log("testing ",dropzone)
            SaveFilesDATA(dropzone , input , "Add", target);
            if(dropzone.classList.contains("blogs-post"))
            {
                textarea.value += `[img${dropzone.children.length}]`;
                
            }
        }

    }
}

function RemoveFile(Xbutton)
{

    setTimeout(()=>{
        let dropzone = Xbutton.parentElement.parentElement.parentElement;

        let file = Xbutton.parentElement.parentElement;
        let index = Array.prototype.indexOf.call(dropzone.children, file) + 1;
        let textarea = typeof dropzone.parentElement.querySelector(".post-input") != 'undefined' ? dropzone.parentElement.querySelector(".post-input") : undefined ;

        console.log(dropzone)
        if(dropzone.classList.contains("dropzone"))
        {
            console.log("contains")
        }
        else
        {
            console.log("does not contain")
            dropzone = dropzone.querySelector(".dropzone")
        }

        console.log(`this is file ///////////`)
        if(file.classList.contains("image"))
        {
            console.log("files")
            console.log(file)
        }
        else
        {
            console.log("files")
            file.querySelector(".image")
            console.log(file)
        }

        if(!dropzone.classList.contains("single") && !dropzone.classList.contains("one") && !dropzone.classList.contains("single") && !dropzone.classList.contains("icon") )
        {
            // console.log("removing : ",index);
            textarea.value = textarea.value.replace(`[img${index}]`, ``);
    
            for(let i = index ; i <= dropzone.children.length+1 ; i++)
            {
                textarea.value = textarea.value.replace(`[img${i}]`, `[img${i-1}]`);
            }
        }
     
        // console.log("\n \n files length : ",files.length,"files : \n",files);
        let input =dropzone.parentElement.querySelector(`[type="file"]`)
    
        if(index - (dropzone.children.length - files.length)  > 0 )
        {
            input.files = SaveFilesDATA(dropzone ,input , "remove" , index - (dropzone.children.length - files.length) -1 );
        }
        files = [...input.files]
    
        console.log( "equation  cildren - files length: ", dropzone.children.length - files.length  )
        console.log( "equation  cildren - files length - index: ", dropzone.children.length - files.length - index  )
        console.log( "equation  index - (cildren - files length)  : ", index - (dropzone.children.length - files.length)  )
        console.log( "index : " , index )
        console.log( "files" ,files )
    
    
    
        // console.log("files : ",files,"\ninput.files : ",input.files);
        file.remove();
        if (dropzone.children.length == 0)
        {
            dropzone.classList.remove("active")
            if (dropzone.classList.contains("single")) 
            {
                dropzone.innerHTML=`<label  for="${input.id}">
                <p class="note">click / drag and drop to add pictures</p>
                </label>`

                if(dropzone.classList.contains("removeimage"))
                {
                    dropzone.parentElement.querySelector("#removeimage").checked=true;
                }
            }
            if (dropzone.classList.contains("icon")) 
            {
                dropzone.innerHTML=`<label  for="${input.id}">
                    <p style="place-self : center;">Icon</p>
                </label>`
            }
        }
    }, 100);
    
}

function CloseOptionMenu(option)
{
    let menu = option.parentElement.parentElement.querySelector(".option-list")||option.parentElement.parentElement.querySelector(".edit-button");
    menu.click()
}

function ChangeOption(option)
{
    let text= option.value;
    let textbox = option.parentElement.parentElement.querySelector(".option-list").querySelector("p");
    textbox.innerHTML = text;
}


function RemoveErrorMsg(button)
{
    setTimeout(()=>{
        button.control.remove() 
        button.parentElement.remove();
        checkMSGs()
    },550)
    
}

function CheckNumberInput(input)
{
    let value = input.value;
    let num = new RegExp(/[0-9]+/gm);
    input.value = value.match(num)
    if(value.length >= 6 )
    {
        input.value = value.substring(0,6);
    }
}

function FixNumber(input)
{
    let value = input.value;
    if(value.length < 6)
    {
        for(let i=value.length; i < 6 ; i++)
        {
            value+="0"
        }
    }
    input.value = value;
}

function RemoveCharacters(text)
{
    let char = new RegExp(/[^0-9]+/g)
    text=  text.replace(char,'');
    // console.log("yes");
}

function ActiveTextarea(textarea)
{
    let TA_width = textarea.getBoundingClientRect().width
    let TA_padding = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--padding')) * 1.5;
    let FontSize=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--p-size'));
    let RowSize= Math.floor(((TA_width - TA_padding)/FontSize)*1.6)-1;
    let maxrows =0;
    if (textarea.classList.contains("post-input"))
    {
        maxrows = 4;
    }
    console.log(maxrows);
    let newrow = new RegExp(`(?<![a-z A-Z \D \d].{${RowSize}})\n.{1}|[a-z A-Z \D \d].{${RowSize}}|\n`,`g`)
    let rows = 0;
    if(textarea.value.match(newrow))
    {
        rows = textarea.value.match(newrow).length;    
    }

    if(rows > maxrows )
    {
        textarea.classList.add("active")
    }
    else
    {
        textarea.classList.remove("active")
    }
}



async function RemoveFile(Image)
{
    let Index = Array.prototype.indexOf.call(Image.parentElement.children, Image);
    let Input = Image.parentElement.parentElement.querySelector("input[type='file']");

    const TextArea = Image.parentElement.parentElement.querySelector(`textarea`);
    const Files = [...Input.files];

    Files.splice(Index, 1);
    console.log(`[img${Index+1}]`)

    
    const NewData = new ClipboardEvent("").clipboardData || new DataTransfer();
    for(const File of Files)
    {
        NewData.items.add(File);
    }
    
    const Expression = new  RegExp(`\\[img${Index+1}\\]`)
    TextArea.value = TextArea.value.replace(Expression,"")         ;
    
    const Matches =  TextArea.value.match(/\[img\d\]/gm)

    if(Matches && Matches.length > 0)
    {
        for (let i = Index; i <= Matches.length; i++) {
            const exp = new RegExp(`\\[img${i+1}\\]`)
            TextArea.value = TextArea.value.replace(exp,`[img${i}]`);
        }
    }

    Image.remove();
    Input.files = NewData.files;
    console.log(Files)
    
}


let container 
let ArrayAccess=0
let Comparisons=0
let Swaps=0

async function updateComparisons(N)
{
    document.documentElement.querySelector(`#Comparisons`).innerHTML=`${N}`
}
async function updateArrayAccess(N)
{
    document.documentElement.querySelector(`#ArrayAccess`).innerHTML=`${N}`
}
async function updateSwaps(N)
{
    document.documentElement.querySelector(`#Swaps`).innerHTML=`${N}`
}

async function Fill(button)
{
    container =button.parentElement.parentElement.querySelector(".container")
    let Amount =button.parentElement.parentElement.querySelector("#Amount").value

    if(isNaN(Amount) )
    {
        return
    }

    console.log(Amount)
    container.innerHTML=``
    
    
    
    await CreateElements(container,Amount).then(async()=>{

        container.children[0].style.setProperty('background-color',`var(--Main-Color)` );

    })
    
    // Loop()
    
}


// change child color to red

async function Swap(container,a,b)
{

    const tmp= parseFloat(getComputedStyle(container.children[a]).getPropertyValue('--size'));
    container.children[a].style.setProperty('--size',`${parseFloat(getComputedStyle(container.children[b]).getPropertyValue('--size'))}px` );
    container.children[b].style.setProperty('--size',`${tmp}px` );
}

const SelectionSort = function(button){
    return new Promise(async(res,rej)=>{

        // let container = button.parentElement.querySelector(".container")
        Comparisons = 0
        ArrayAccess = 0
        Swaps = 0
        updateArrayAccess(ArrayAccess)
        updateComparisons(Comparisons)
        updateSwaps(Swaps)

        if(!container){
            rej("error")
        }

        let length = container.children.length
        let Size1 
        let Size2
        let min
        
        for (let i = 0; i < length; i++) {

            container.children[i].style.setProperty('background-color',`var(--Main-Color)` );

            min = i;
            
            for (let j = i+1; j < length; j++) {
                
                
                Size1 = parseFloat(getComputedStyle(container.children[min]).getPropertyValue('--size'));
                Size2 = parseFloat(getComputedStyle(container.children[j]).getPropertyValue('--size'));

                // viualisation
                container.children[j].style.setProperty('background-color',`var(--H4-Color)` );
                
                await delay(1)
                Comparisons++
                ArrayAccess+=2
                updateComparisons(Comparisons)
                updateArrayAccess(ArrayAccess)
                if(Size2 < Size1)
                {
                    // visualisation
                        // change last min color
                    container.children[min].style.setProperty('background-color',`var(--H4-Color)` );
                    min = j;
                    container.children[j].style.setProperty('background-color',`var(--H3-Color)` );

                    container.children[i].style.setProperty('background-color',`var(--Main-Color)` );
                }
            }

            // swap operation
            let currentsize = parseFloat(getComputedStyle(container.children[i]).getPropertyValue('--size'))
            let minsize = parseFloat(getComputedStyle(container.children[min]).getPropertyValue('--size'))

            ArrayAccess+=2
            Comparisons++
            updateComparisons(Comparisons)
            updateArrayAccess(ArrayAccess)
            if(minsize < currentsize)
            {
                await delay(1)
                Swaps++
                updateSwaps(Swaps)
                Swap(container,i,min)
            }

            for (let j = i+1; j < length; j++) {
                container.children[j].style.setProperty('background-color',`var(--normal-text-color)` );
            }
            container.children[i].style.setProperty('background-color',`var(--normal-text-color)` );;
        }
        
    })
}

const InsertionSort = function(button){
    return new Promise(async(res,rej)=>{

        Comparisons = 0
        ArrayAccess = 0
        Swaps = 0
        updateArrayAccess(ArrayAccess)
        updateComparisons(Comparisons)
        updateSwaps(Swaps)
        // console.log(button.parentElement.parentElement)
        let container = button.parentElement.parentElement.querySelector(".container")
        if(!container){
            rej()
        }

        let length = container.children.length
        let Size1 
        let Size2

        for (let i = 1; i < length; i++) {

            container.children[i].style.setProperty('background-color',`var(--Main-Color)` );

            for (let j = i; j > 0; j--) {
                
                
                Size1 = parseFloat(getComputedStyle(container.children[j]).getPropertyValue('--size'));
                Size2 = parseFloat(getComputedStyle(container.children[j-1]).getPropertyValue('--size'));

                container.children[j].style.setProperty('background-color',`var(--H4-Color)` );
                
                ArrayAccess+=2
                Comparisons++
                updateComparisons(Comparisons)
                updateArrayAccess(ArrayAccess)

                await delay(1)
                if(Size2 > Size1)
                {
                    Swaps++
                    updateSwaps(Swaps)

                    Swap(container,j,j-1)
                    await delay(1)
                    container.children[i].style.setProperty('background-color',`var(--Main-Color)` );
                }
            }

            for (let j = 0; j <= i; j++) {
                container.children[j].style.setProperty('background-color',`var(--normal-text-color)` );
            }
        }
        console.log(await CheckSorted(0))
    })
}


const CreateElements = function (container, rand) {
    return new Promise( async(res,rej)=>{
        if(!container)
            rej("error")

        let maxSize= container.getBoundingClientRect().height;
        for(let i=0 ; i < rand ; i++)
        {
            let rand2 = Math.random() * maxSize
            let size = Math.floor(parseFloat(rand2.toFixed(4)))
            container.innerHTML+=`<div class="column" style="--size:${size}px"></div>`

        }
        res("done")
    })
  };
const delay = ms => new Promise(res => setTimeout(res, ms));


async function CheckSorted(Accending)
{
    if(Accending == 1)
    {
        for (let index = 1; index < container.children.length; index++) {
            let Size1 = parseFloat(getComputedStyle(container.children[index]).getPropertyValue('--size'));
            let Size2 = parseFloat(getComputedStyle(container.children[index-1]).getPropertyValue('--size'));
    
            container.children[index].style.setProperty('background-color',`var(--H4-Color)` );
            if(Size1 < Size2)
            {
                container.children[index].style.setProperty('background-color',`var(--H3-Color)` );
                await delay(1)
                return false
            }
        }
        for (let index = 0; index < container.children.length; index++) {
            container.children[index].style.setProperty('background-color',`var(--normal-text-color)` );
        }
        return true
    }
    else
    {
        for (let index = 1; index < container.children.length; index++) {
            let Size1 = parseFloat(getComputedStyle(container.children[index]).getPropertyValue('--size'));
            let Size2 = parseFloat(getComputedStyle(container.children[index-1]).getPropertyValue('--size'));
    
            container.children[index].style.setProperty('background-color',`var(--H4-Color)` );
            if(Size1 > Size2)
            {
                container.children[index].style.setProperty('background-color',`var(--H3-Color)` );
                await delay(1)
                return false
            }
        }
        for (let index = 0; index < container.children.length; index++) {
            container.children[index].style.setProperty('background-color',`var(--normal-text-color)` );
        }
        return true
    }
}


async function QS()
{
    let Start = 0
    let End = container.children.length-1

    Comparisons = 0
    ArrayAccess = 0
    Swaps = 0
    updateArrayAccess(ArrayAccess)
    updateComparisons(Comparisons)
    updateSwaps(Swaps)

    await QuickSort(container,Start,End)
    // await CheckSorted(1)
}




async function QuickSort(container,Start,End)
{
    
    if(Start > End -1 )
    {
        return
    }
    else
    {
        container.children[Start].style.setProperty('Background-color',`var(--H4-Color)` )
        container.children[End].style.setProperty("Background-color", `var(--H4-Color)`)
        console.log(End - Start)

        let PivPoint = await getPivotPoint(container,Start,End)
        PivPoint = await SwapAroundPivot(container,Start,End,PivPoint)

        await QuickSort(container,Start,PivPoint-1)
        await resetColors()
        await QuickSort(container,PivPoint+1,End)
        await resetColors()
        
    }
}


async function getPivotPoint(container,Start,End)
{
    let PivPoint = Math.floor((Start+End)/2)
    
    let First= parseFloat(getComputedStyle(container.children[Start]).getPropertyValue('--size'));
    let Last=parseFloat(getComputedStyle(container.children[End]).getPropertyValue('--size'));
    let Middle=parseFloat(getComputedStyle(container.children[PivPoint]).getPropertyValue('--size'));

    Comparisons+=2
    ArrayAccess+=3
    updateComparisons(Comparisons)
    updateArrayAccess(ArrayAccess)
    if(Last > First)
    {
        if(Middle < First)
        {
            console.log(`Pivot point is : ${First} at ${Start}`)
            console.log(`first is :${First}\n middle is :${Middle}\n Last is ${Last}`)
            return Start
        }
        else {
            return PivPoint
        }
    }
    else
    {
        if(Middle < Last)
        {
            return PivPoint
        }
        else {
            return End
        }
    }
}

async function SwapAroundPivot(container,Start,End,PivPoint)
{
    if(End - Start  == 1)
    {
        console.log(`is only 2 `)
        container.children[Start].style.setProperty('Background-color',`var(--H2-Color)`)
        container.children[End].style.setProperty('Background-color',`var(--H3-Color)`)

        Comparisons++
        ArrayAccess+=2
        updateArrayAccess(ArrayAccess)
        updateComparisons(Comparisons)

        if (parseFloat(getComputedStyle(container.children[Start]).getPropertyValue('--size')) > parseFloat(getComputedStyle(container.children[End]).getPropertyValue('--size')) )
        {
            Swaps++
            updateSwaps(Swaps)

            await delay(1)
            Swap(container,Start,End)
        }
        return PivPoint
    }
    else
    {
        let i= Start , j = End;
        let middle = parseFloat((Start+End)/2)
        Swap(container,PivPoint,End)
        await delay(1)

        while(i < j)
        {
            await delay(1)
            container.children[i].style.setProperty('Background-color',`var(--H2-Color)`)
            container.children[j].style.setProperty('Background-color',`var(--H3-Color)`)

    
            Comparisons++
            ArrayAccess+=2

            updateArrayAccess(ArrayAccess)
            updateComparisons(Comparisons)

            if( parseFloat(getComputedStyle(container.children[i]).getPropertyValue('--size')) > parseFloat(getComputedStyle(container.children[End]).getPropertyValue('--size')) )
            {
                Comparisons++
                ArrayAccess+=2
                
                updateArrayAccess(ArrayAccess)
                updateComparisons(Comparisons)

                if(parseFloat(getComputedStyle(container.children[j]).getPropertyValue('--size')) >= parseFloat(getComputedStyle(container.children[End]).getPropertyValue('--size')))
                {
                    j--
                }
                else
                {
                    Swaps++
                    updateSwaps(Swaps)

                    await delay(1)
                    Swap(container,i,j)
                    i++
                }
            }
            else
            {
                i++
            }
            container.children[Start].style.setProperty('Background-color',`var(--H6-Color)` )
            container.children[End].style.setProperty("Background-color", `var(--H6-Color)`)
        }

        Comparisons++
        ArrayAccess+=2

        updateArrayAccess(ArrayAccess)
        updateComparisons(Comparisons)

        if(parseFloat(getComputedStyle(container.children[End]).getPropertyValue('--size')) < parseFloat(getComputedStyle(container.children[j]).getPropertyValue('--size')))
        {
            Swaps++
            updateSwaps(Swaps)

            Swap(container,End,j)
        }
        await resetColors()
        return j
    }
}


async function MS(button)
{
    container =button.parentElement.parentElement.querySelector(".container")
    
    Comparisons=0
    ArrayAccess=0
    Swaps = 0

    updateComparisons(Comparisons)
    updateArrayAccess(ArrayAccess)
    updateSwaps(Swaps)


    await MergeSort([...container.children],0, container.children.length)
    // await DrawSorted(sorted)
}




async function MergeSort(arr,Start,End)
{

    let length = arr.length
    
    
    if(length <= 1 )
    {
        // console.log('deez nuts')
        return 
    }

    let midpoint = Math.ceil(arr.length/2)
    
    
    let Right = arr.slice(0,midpoint)
    let Left = arr.slice(midpoint,arr.length)
    
    // console.log(`(${midpoint} + $)/2 - ${Start} = ${Math.abs(Math.floor((End + Start)/2))}\nmidPoint ${midpoint}`)
    midpoint +=  Start

    await MergeSort(Right,Start,midpoint)
    
    await MergeSort(Left,midpoint,End)
    
    
    // console.log(Right)
    // console.log(Left)
    await Merge(Right,Left,Start,midpoint,End)
    // console.log()
    
}

// create function to merge array and draw them on the container 
async function Merge(Right,Left,Start,midpoint,End)
{

    let i = Start
    let j = midpoint

    console.log(` right ${Right.length}\n left ${Left.length}\n mid ${midpoint}`)
    let Sorted=[]
    while(j < End && i < midpoint)
    {
        container.children[i].style.setProperty(`Background-color`,`var(--H6-Color)`)
        container.children[j].style.setProperty(`Background-color`,`var(--H6-Color)`)
        const val1 = await parseFloat(getComputedStyle(container.children[i]).getPropertyValue('--size'))
        const val2 = await parseFloat(getComputedStyle(container.children[j]).getPropertyValue('--size'))
        // i++
        // j++
        ArrayAccess+=2
        Comparisons++
        updateComparisons(Comparisons)
        updateArrayAccess(ArrayAccess)

        await delay(1)
        
        if(val1 < val2)
        {
            Sorted.push(val1)
            i++
            
        }
        else
        {
            Sorted.push(val2)
            j++            
        }
        
    }
    
    
    console.log(` i ${i} midpoint ${midpoint} ${j} End ${End}`)
    while(i < midpoint)
    {
        ArrayAccess++
        updateArrayAccess(ArrayAccess)
        
        const val = await parseFloat(getComputedStyle(container.children[i]).getPropertyValue('--size'))
        console.log(` i ${i} `)
        Sorted.push(val)
        container.children[i].style.setProperty(`Background-color`,`var(--H6-Color)`)
        await delay(1)
        i++
    }
    
    
    while (j < End)
    {
        ArrayAccess++
        updateArrayAccess(ArrayAccess)

        const val = await parseFloat(getComputedStyle(container.children[j]).getPropertyValue('--size'))
        Sorted.push(val)
        console.log(` j ${j} `)
        container.children[j].style.setProperty(`Background-color`,`var(--H6-Color)`)
        await delay(1)
        j++
    }


    console.log(Sorted)
    await resetColors()
    await DrawSorted(Sorted,Start,End)
}


async function DrawSorted(Sorted,Start,End)
{
    let index = 0
    // console.lop(Sorted)
    for (let i = Start; i < End; i++) {

        container.children[i].style.setProperty(`Background-color`,`var(--H6-Color)`)
        ArrayAccess++
        updateArrayAccess(ArrayAccess)
        // console.log(`size ${getComputedStyle(Sorted[index]).getPropertyValue('--size')}`)
        container.children[i].style.setProperty(`--size`,`${Sorted[index]}px`)
        await delay(1)
        if(i > 0)
            container.children[i-1].style.setProperty(`Background-color`,`var(--normal-text-color)`)
        
        index++
    }
}




async function HS(button)
{
    container = await button.parentElement.parentElement.querySelector(".container")

    Comparisons=0
    ArrayAccess=0
    Swaps = 0

    updateComparisons(Comparisons)
    updateArrayAccess(ArrayAccess)
    updateSwaps(Swaps)

    let index = container.children.length-1

    while (index >= 0) {
        console.log(index)
        await HeapSort(container,0, index)

        Swaps++
        updateSwaps(Swaps)

        await Swap(container,index,0)
        await delay(1)
        container.children[index].style.setProperty(`Background-color`, `var(--normal-text-color)`)
        index-- 
    }
}


async function  HeapSort(container,index , max){

    // console.log(index)
    if (index > max || index==null)
    {
        return null
    }

    
    let l = await getLeftChildIndex(index)
    let r = await getRightChildIndex(index)


    // console.log(`index : ${index}`)
    let left=await HeapSort(container,l,max)
    let right= await HeapSort(container,r,max)

    
    
    applyColor(index)
    // applyColor(right)
    // applyColor(left)
    

    let ValI  = await parseInt(getComputedStyle(container.children[index]).getPropertyValue('--size'))

    Comparisons++
    updateComparisons(Comparisons)
    if( right == null && left == null)
    {
        return index
    }


    Comparisons++
    updateComparisons(Comparisons)
    if(left == null )
    {
        

        let ValR = await parseInt(getComputedStyle(container.children[right]).getPropertyValue('--size'))
        
        Comparisons++
        updateComparisons(Comparisons)

        ArrayAccess+=2
        updateArrayAccess(ArrayAccess)
        if(ValR > ValI )
        {
            Swaps++
            updateSwaps(Swaps)

            await Swap(container,right,index)
        }
    }
    else if(right == null)
    {
        // console.log(`left : ${left}`)
        // console.log(`right : ${right}`)
        let ValL = await parseInt(getComputedStyle(container.children[left]).getPropertyValue('--size'))

        Comparisons++
        updateComparisons(Comparisons)

        ArrayAccess+=2
        updateArrayAccess(ArrayAccess)

        if(ValL > ValI)
        {
            Swaps++
            updateSwaps(Swaps)

            await Swap(container, left,index)
        }
    }
    
    else
    {
        // console.log(`left : ${left}`)
        // console.log(`right : ${right}`)

        let ValR=await parseInt(getComputedStyle(container.children[right]).getPropertyValue('--size'))
        let ValL=await parseInt(getComputedStyle(container.children[left]).getPropertyValue('--size'))

        Comparisons++
        updateComparisons(Comparisons)

        ArrayAccess+=2
        updateArrayAccess(ArrayAccess)

        if(ValR < ValL)
        {
            Comparisons++
            updateComparisons(Comparisons)

            ArrayAccess+=2
            updateArrayAccess(ArrayAccess)
            if(ValL > ValI)
            {
                Swaps++
                updateSwaps(Swaps)

                await Swap(container, left,index)
            }
        }
        else
        {

            Comparisons++
            updateComparisons(Comparisons)

            ArrayAccess+=2
            updateArrayAccess(ArrayAccess)

            if(ValR > ValI )
            {
                Swaps++
                updateSwaps(Swaps)
                await Swap(container,right,index)
            }
        }

    }
    // await delay(0)
    return index
}
async function applyColor(index)
{
    let height= getHeight(index)

    switch (height) {
        case 0:
            container.children[index].style.setProperty(`Background-color`, `var(--Main-Color)`)
            break;
        case 1:
            container.children[index].style.setProperty(`Background-color`, `var(--H2-Color)`)
            break;
        case 2:
            container.children[index].style.setProperty(`Background-color`, `var(--H3-Color)`)
            break;
        case 3:
            container.children[index].style.setProperty(`Background-color`, `var(--H4-Color)`)
            break;
        case 4:
            container.children[index].style.setProperty(`Background-color`, `var(--H5-Color)`)
            break;
        case 5:
            container.children[index].style.setProperty(`Background-color`, `var(--H6-Color)`)
            break;
        case 6:
            container.children[index].style.setProperty(`Background-color`, `var(--H7-Color)`)
            break;
        case 7:
            container.children[index].style.setProperty(`Background-color`, `var(--H8-Color)`)
            break;
        case 8:
            container.children[index].style.setProperty(`Background-color`, `var(--H9-Color)`)
            break;
        case 9:
            container.children[index].style.setProperty(`Background-color`, `var(--H10-Color)`)
            break;
        case 10:
            container.children[index].style.setProperty(`Background-color`, `var(--H11-Color)`)
            break;
        case 11:
            container.children[index].style.setProperty(`Background-color`, `var(--H12-Color)`)
            break;
    }
}

async function getLeftChildIndex(x){

    let pos = (2*(x)) +1 ;
    

    if((pos < container.children.length))
        return pos
    
    return null
}
async function getRightChildIndex(x)
{
    let pos = 2*(x) + 2
    // if(x == 0)
    //     return null
    
    if(pos < container.children.length)
        return pos
    
    return null
}


async function getParentIndex(arr,x)
{
    if(x == 0)
        return 0
    
    let pos = Math.floor((x-1)/2)
    return pos
}

function getHeight(x)
{
    return Math.ceil(Math.log(x + 1) / Math.log(2)) - 1;
}


async function resetColors()
{
    for (let index = 0; index < container.children.length; index++) {
        container.children[index].style.setProperty('Background-color',`var(--normal-text-color)`)
    }
}