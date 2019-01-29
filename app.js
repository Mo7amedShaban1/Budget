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
            exp : 0,
            subtract : 0,
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
        data : allData,
        calcBudget : function(type){
            let sum = 0;
            allData.allItem[type].forEach(current => {
                sum += current.value;
            });
            allData.totals[type] = sum;
            allData.totals.subtract = allData.totals.inc - allData.totals.exp;
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
        incContainer : ".container_incomes .products",
        expContainer : ".container_expenses .products",
        incomes      : ".incomes span",
        expenses     : ".expenses span",
        totals       : ".total-budget",
        remove       : ".remove_item",
        product      : ".products"
    }

    return {
        getInputValue : function(){
            return{
                type        : document.querySelector(classesDom.type).value,
                description : document.querySelector(classesDom.description).value,
                value       : Number(document.querySelector(classesDom.value).value)
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
            document.querySelector(classesDom.value).value = "";
            document.querySelector(classesDom.description).focus()
        },
        updateBudget: function(totals){
            document.querySelector(classesDom.incomes).innerHTML = `+ ${totals.inc}`;
            document.querySelector(classesDom.expenses).innerHTML = `- ${totals.exp}`;

            let addSymbol = function(){
                if(totals.subtract > 0){
                    return `+ ${totals.subtract}`
                }else{
                    return `${totals.subtract}`
                }
            }
            
            document.querySelector(classesDom.totals).innerHTML = addSymbol();
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

        document.querySelector(domElement.description).addEventListener('keyup',validDescription)
        document.querySelector(domElement.value).addEventListener('change',validVal)

        document.querySelector(domElement.product).addEventListener('click', function(e){
            // console.log(e.target.parentNode('.product'))
        })
    }

    let validDescription = function (){
        inputValue = view.getInputValue();

        if(inputValue.description === ""){
            document.querySelector(domElement.description).classList.add('not_valid')
        }else{
            document.querySelector(domElement.description).classList.remove('not_valid')
        }
    }

    let validVal = function (){
        inputValue = view.getInputValue();

        if(inputValue.value <= 0){
            document.querySelector(domElement.value).classList.add('not_valid')
        }else{
            document.querySelector(domElement.value).classList.remove('not_valid')
        }
    }

    // Run Function

    let runFunction = function(){
        inputValue = view.getInputValue();
        
        validDescription();
        validVal();

        if(inputValue.description !== "" && inputValue.value > 0){
            newItem = model.addNewItem(inputValue.type,inputValue)
            view.addNewItem(inputValue.type,newItem)
            view.clearInputs();

            model.calcBudget('inc')
            model.calcBudget('exp')

            view.updateBudget(model.data.totals)
        }
        
    }


    return {
        init : function(){
            addEventListener()
        }
    }

})(appModel,appView)

appController.init();