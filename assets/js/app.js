
const cl = console.log;
const showmoves = document.getElementById('showmoves'),
mymodel = document.getElementById('mymodel'),
backdrop = document.getElementById('backdrop'),
titlecontrol = document.getElementById('title'),
Imagecontrol = document.getElementById('imageurl'),
ratingcontrol = document.getElementById('rating'),
addmovebtn =document.getElementById('addmovebtn'),
updatebtn = document.getElementById('updatebtn'),
formcontainer = document.getElementById('moveform'),
movecontainer = document.getElementById("movecontainer");
const moveclose = [...document.querySelectorAll(".moveclose")]


let baseurl = `https://movie-card-by-firebase-default-rtdb.asia-southeast1.firebasedatabase.app/`
let posturl =`${baseurl}/movies.json`

cl(posturl)
const templating = (arr) => {
    let reault = " ";
    arr.forEach(ele => {
        reault += `  
                    
                  
                        <div class="card mb-4" id ="${ele.id}">
                            <div class="card-header">
                                <h2>
                                    ${ele.title}
                                </h2>
                            </div>
                            <div class="card-body">
                                <img src="${ele.imgeurl}" alt="" class="img-fluid imagecover">
                            </div>
                            <div class="card-footer text-right">
                               <div class ="text-left">
                                  ${ele.rating}/5
                               </div>
                                <hr>
                                <button class="btn btn-info" onclick="editedbtn(this)" type="button">
                                    Edit
                               </button>
                                <button class="btn btn-danger" onclick="deletedbtn(this)" type="button">
                                   Delete
                                </button>
                            </div>
                        </div>
                    
        `
    })
    movecontainer.innerHTML = reault
}

const  makeapicall =(methodname, apiurl , bodymsg) =>{
    return fetch(apiurl, {
        method :methodname,
        body : JSON.stringify(bodymsg),
        headers :{
            "Autharazation": "Bearer Token",
            "content-type": "application/json; charset=UTF-8"
        }
    })
    .then( res =>{
        return res.json()
    })

}
makeapicall("GET" , posturl )
 .then(res =>{
    cl(res)
    let arr =[];
    for (const key in res) {
       
         let obj ={
             id : key,
             ...res[key]
         }
         arr.push(obj)
    }
    templating(arr)
 }) 
 .catch(rej =>{
    cl(rej)
 })


 formcontainer.addEventListener("submit"  , (eve) =>{
    eve.preventDefault()

    let postobj ={
        title : titlecontrol.value,
        imgeurl : Imagecontrol.value,
        rating : ratingcontrol.value
    }
    makeapicall("post" , posturl ,postobj)
         .then(res =>{
              cl(res)
              let card =document.createElement('div');
              card.className ='card mb-4'
              card.id =res.name
              let result  = 
              `
                    <div class="card-header">
                        <h2>
                            ${postobj.title}
                        </h2>
                    </div>
                    <div class="card-body">
                        <img src="${postobj.imgeurl}" alt="" class="img-fluid imagecover">
                    </div>
                    <div class="card-footer text-right">
                        <div class ="text-left">
                            ${postobj.rating}/5
                        </div>
                        <hr>
                        <button class="btn btn-info" onclick="editedbtn(this)" type="button">
                            Edit
                        </button>
                        <button class="btn btn-danger" onclick="deletedbtn(this)" type="button">
                            Delete
                        </button>
                    </div>
              
              `
              card.innerHTML =result;
              movecontainer.prepend(card);
              formcontainer.reset()
              mymodel.classList.toggle('visible'); 
              backdrop.classList.toggle('visible') 
         }) 
         .catch(rej =>{
              cl(rej)
         })
         .finally( fin =>{
           
         })
 })
const editedbtn = (ele) =>{
    let editedid =ele.closest(".card").id;
    localStorage.setItem("editedId" ,editedid)
    let editedurl =`${baseurl}/movies/${editedid}.json`
    cl(editedurl)
    makeapicall("GET" , editedurl)
       .then(res =>{
          cl(res) 
          titlecontrol.value = res.title;
          Imagecontrol.value =res.imgeurl;
          ratingcontrol.value=res.rating;
          mymodel.classList.toggle('visible');  
          backdrop.classList.toggle('visible') 
          updatebtn.classList.remove('d-none');
          addmovebtn.classList.add('d-none')
       }) 
       .catch(rej =>{
          cl(rej)
       })
}
updatebtn.addEventListener("click" , (e) =>{
    let updateid =localStorage.getItem('editedId');
    let updateurl =`${baseurl}/movies/${updateid}.json`
     let patch1 ={
        title : titlecontrol.value,
        imgeurl : Imagecontrol.value,
        rating : ratingcontrol.value
     }
    makeapicall("PATCH" , updateurl, patch1)
        .then(res =>{
           cl(res)
           const updatedid = [...document.getElementById(updateid).children];
            cl(updatedid)
            updatedid[0].innerHTML =` <h3>${patch1.title}</h3>`
            updatedid[1].innerHTML =`${patch1.imgeurl}`
            updatedid[2].innerHTML =`<p>${patch1.rating}</p>`
            mymodel.classList.toggle('visible'); 
            backdrop.classList.toggle('visible')
            formcontainer.reset()
        }) 
        .catch(rej =>{
           cl(rej)
        })
})
const deletedbtn =(ele) =>{
    let deletedid =ele.closest('.card').id;
    let deletedurl =`${baseurl}/movies/${deletedid}.json`
    makeapicall("DELETE" , deletedurl)
    .then(res =>{
        let deletedcard =document.getElementById(deletedid)
        deletedcard.remove()
    }) 
     .catch(rej =>{
        cl(rej)
     })
}





const onclicthandler = () => {
    mymodel.classList.toggle('visible');
    backdrop.classList.toggle('visible')
}
showmoves.addEventListener('click', onclicthandler);
moveclose.forEach(ele => ele.addEventListener('click', onclicthandler));


