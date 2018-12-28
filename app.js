// App model

const appModel = (function(){

    let Incomes = function(id,description,value){
        this.id          = id ;
        this.description = description;
        this.value       = value
    }

    let Expenses = function(id,description,value){
        this.id          = id ;
        this.description = description;
        this.value       = value
    }

    let allData = {
        allItem : {
            inc : [],
            exp : [],
        },
        totals: {
            inc : 0,
            exp : 0
        }
    }

    return {
        addNewItem : function(type,obj){

            var id , newItem;
            id =  allData.allItem[type].length + 1;

            if(type === 'inc'){
                newItem = new Incomes(id,obj.description,obj.value);
            }else if(type === 'exp'){
                newItem = new Expenses(id,obj.description,obj.value)
            }

            allData.allItem[type].push(newItem);
            return newItem;
        },
        data : function(){
            return allData
        }
    }

})();


// App View

const appView = (function(){

    let classesDom = {
        type         : ".add_type",
        description  : ".add_description",
        value        : ".add_value",
        btn          : ".add_btn",
        incContainer : ".container_incomes",
        expContainer : ".container_expenses",
    }

    return {
        getInputValue : function(){
            return{
                type        : document.querySelector(classesDom.type).value,
                description : document.querySelector(classesDom.description).value,
                value       : document.querySelector(classesDom.value).value
            }  
        },
        domElement : classesDom ,
        addNewItem :  function(type,obj){    
            let html, element;
            if(type === 'inc'){
                element = classesDom.incContainer;
                html = `
                    <div class="product d-flex justify-content-between align-items-center">
                        <p class="m-0">${obj.description}</p>
                        <div>
                            <span class="value_item">+ ${obj.value}</span>
                            <button class="remove_item"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>`;
            }else if(type =='exp'){
                element = classesDom.expContainer;
                html = `
                    <div class="product d-flex justify-content-between align-items-center">
                        <p class="m-0">${obj.description}</p>
                        <div>
                            <span class="value_item">- ${obj.value}</span>
                            <button class="remove_item"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>`;
            }
            document.querySelector(element).insertAdjacentHTML('beforeend',html)
        },
        clearInputs : function(){
            document.querySelector(classesDom.description).value = "";

        }

    }

})();


// App Controller

const appController = (function(model,view){

    let domElement , inputValue , newItem;
    domElement = view.domElement;

    // Function Add Event Listener 

    let addEventListener = function(){

        document.querySelector(domElement.btn).addEventListener('click',runFunction)

        document.addEventListener('keypress',function(event){
            if(event.keyCode === 13 , event.which === 13){
                runFunction()
            }
        })

    }
    
    // Run Function

    let runFunction = function(){
        inputValue = view.getInputValue();
        newItem = model.addNewItem(inputValue.type,inputValue)

        view.addNewItem(inputValue.type,newItem)
        view.clearInputs()
    }



    // return Methods in order to run all function 

    return {
        init : function(){
            addEventListener()
        }
    }

})(appModel,appView)

appController.init();