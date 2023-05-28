setTimeout(function(){
    document.body.className="";
},500);

async function TextAreaSize(TA)
{
    
    let Width = TA.getBoundingClientRect().width;
    let FontSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--REM-size'));
    let PaddingSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--Padding-size'));
    let ThreshHold = (TA.classList.contains("Post-Textarea") ? 4 : 1)

    const RowLength =  Math.floor(( Width - PaddingSize * 2 )/(FontSize * .63))

    const Match = new RegExp(`(.{${RowLength}}|.{0,${RowLength}}\\n)`,"gm");

    let Matches = TA.value.match(Match,"gm");

    // console.log(ThreshHold)
    // console.log(Matches.length)
    if(Matches && Matches.length &&  Matches.length > ThreshHold)
    {
        TA.classList.add("expand")
    }
    else
    {
        TA.classList.remove("expand")
    }
}

window.addEventListener("dragover",function(e)
{
    e = e || event;
    e.preventDefault();
});
window.addEventListener("drop",function(e)
{
    e = e || event;
    e.preventDefault();
});

let OldFiles;

async function GetFilesFromInput(element)
{
    const inputElement = element.parentElement.querySelector("input[type='file']")
    OldFiles = [...inputElement.files]
    console.log(`OldFiles : ${OldFiles}`)
    // FileDialogInput(inputElement,OldFiles)
}

async function FileDialogInput(Input)
{
    const DropZone = Input.parentElement.querySelector(".Drop-Zone");
    const TextArea = DropZone.parentElement.querySelector(`textarea`);
    

    const NewData = new ClipboardEvent("").clipboardData || new DataTransfer();

    for(const File of [...OldFiles])
    {
        NewData.items.add(File);
    }
    for(const File of [...Input.files])
    {
        NewData.items.add(File);
        TextArea.value+= `[img${OldFiles.length+Array.prototype.indexOf.call(Input.files, File)+1}]`

        RenderFile(File,DropZone)
    }
    
    Input.files = NewData.files;
    // console.log("New data")
    // console.log(NewData)
    // console.log(Input.files)

}



async function DropFile(DropArea,event)
{
    const DropZone = DropArea.parentElement.querySelector(".Drop-Zone");
    const Input = DropArea.parentElement.querySelector("input[type='file']");

    const newFiles = [...event.dataTransfer.files];
    const oldFiles = [...Input.files];

    const NewData = new ClipboardEvent("").clipboardData || new DataTransfer();
    const TextArea = DropZone.parentElement.querySelector(`textarea`);

    if(oldFiles && oldFiles.length && oldFiles.length < 0)
    {
        for(const File of [...OldFiles])
        {
            NewData.items.add(File);
        }
    }

    for(const File of newFiles)
    {
        NewData.items.add(File);
        TextArea.value+= `[img${oldFiles.length+Array.prototype.indexOf.call(newFiles, File)+1}]`
        RenderFile(File,DropZone)
    }

    

    console.log(oldFiles);
    console.log(newFiles);
    console.log(DropArea);

    Input.files = NewData.files;
}

async function RenderFile(File,DropZone)
{
    const reader = new FileReader();
    await reader.readAsDataURL(File)
    reader.onload = ()=>
    {
        DropZone.innerHTML += `<img src="${reader.result}" alt="" onclick="RemoveFile(this)">`
    }
}


async function RemoveFile(Image)
{
    let Index = Array.prototype.indexOf.call(Image.parentElement.children, Image);
    console.log("Index")
    let Input = Image.parentElement.parentElement.parentElement.querySelector("input[type='file']");


    const TextArea = Image.parentElement.parentElement.querySelector(`textarea`);
    const Files = [...Input.files];

    Files.splice(Index, 1);
    // console.log(`[img${Index+1}]`)

    
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
    // console.log(Files)
    
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