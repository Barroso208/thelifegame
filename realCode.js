const tablero = document.getElementById("tablero");
const textoGeneracion = document.getElementById("generacion");
const velocidad = document.getElementById('velocidad')
const boton1 = document.getElementById('boton1');
const boton2 = document.getElementById('boton2');
let celdas = [];
let f = 100;
let c = 100;
let numero = 1;
let colorDeCelda = '#fff'
let generacion = 0;
let contadorParar = 0; 
let loop;
let ancho = screen.width;
let alto = screen.height;
let tiempo = 300;
let intensidadMuerte = 17;
let u = 0;
let h = false;
/* Function que determina las celdas que deben vivir para formar la figura */
function barcoM(k,j){
    if(h === false){   
        console.log(celdas[k][j])
        celdas[k][j].estado = 1;
        celdas[k][j].name.style.backgroundColor = colorDeCelda;
    }else{
        celdas[k][j].estado = 1;
        celdas[k][j+4].estado = 1;
        celdas[k+1][j+5].estado = 1;
        celdas[k+2][j+5].estado = 1;
        celdas[k+2][j].estado = 1;
        celdas[k+3][j+1].estado = 1;
        celdas[k+3][j+2].estado = 1;
        celdas[k+3][j+3].estado = 1;
        celdas[k+3][j+4].estado = 1;
        celdas[k+3][j+5].estado = 1;
        celdas[k][j].name.style.backgroundColor = colorDeCelda;
        celdas[k][j+4].name.style.backgroundColor = colorDeCelda;
        celdas[k+1][j+5].name.style.backgroundColor = colorDeCelda;
        celdas[k+2][j+5].name.style.backgroundColor = colorDeCelda;
        celdas[k+2][j].name.style.backgroundColor = colorDeCelda;
        celdas[k+3][j+1].name.style.backgroundColor = colorDeCelda;
        celdas[k+3][j+2].name.style.backgroundColor = colorDeCelda;
        celdas[k+3][j+3].name.style.backgroundColor = colorDeCelda;
        celdas[k+3][j+4].name.style.backgroundColor = colorDeCelda;
        celdas[k+3][j+5].name.style.backgroundColor = colorDeCelda;
    }
}
boton1.addEventListener('click', function(){
    if(u === 0){
        boton1.style.backgroundColor = 'rgb(0, 146, 19)';
        tablero.style.borderTop = '1px solid rgb(110, 110, 110)'
        tablero.style.borderRight = '1px solid rgb(110, 110, 110)'
        u = 1;
    }else{
        boton1.style.backgroundColor = 'rgb(49, 49, 49)';
        tablero.style.borderTop = '1px solid black'
        tablero.style.borderRight = '1px solid black'
        u = 0;
    }
})

boton2.addEventListener('click', function(){
    if(h === false){
        h = true;
        boton2.textContent = 'Barco';
        boton2.style.backgroundColor = 'rgb(0, 146, 19)';
    }else{
        h = false;
        boton2.textContent = 'Unidad';
        boton2.style.backgroundColor = 'rgb(49, 49, 49)';
    }
})
/* Todo lo relacionado con parametros */
velocidad.addEventListener('click',function(e){
    const elemento = e.target;
    for(let i = 1;i<4;i++){document.getElementById(i).style.backgroundColor = 'transparent';}
    elemento.style.backgroundColor = 'rgb(92, 92, 92)';
    switch(e.target.getAttribute('name')){
        case '1':tiempo=300;break;
        case '2':tiempo=100;break;
        case '3':tiempo=10;break;
        default:break;
    }
    clearInterval(loop);
    bucle()
})
/* Creador de objetos para cada una de las celdas */
class cell{
    constructor(name, estado, k, j){
        this.name = document.getElementById(name);
        this.k = k;
        this.j = j;
        this.estado = estado;
        this.estadoAnterior = 0;
        this.vecinos = 0;
        this.nuevosvecinos;
    }
}

/* Creamos un arrays dentro de un array para formar el tablero */
function crearTablero(){
    for(let k = 0; k < f;k++){
        celdas.push([]);
        for(let j = 0;j < c;j++){
            let elemento = tablero.appendChild(document.createElement('div'));
            elemento.setAttribute('id','cell' + numero);
            elemento.setAttribute('k',k);
            elemento.setAttribute('j',j);
            elemento.setAttribute('class','celda');
            celdas[k].push(new cell("cell"+ numero,0,k,j));
            numero++;
        }
    }
}

/* Pintar los valores en pantalla */
function pintarCeldas(){
    for(let k = 0; k < f;k++){
        for(let j = 0;j < c;j++){
            if(celdas[k][j].estado === 0){
                celdas[k][j].name.style.backgroundColor = '#000';
            }else{
                if((celdas[k][j].estado === 1) && (celdas[k][j].estadoAnterior === 1 )){
                    let colorAnterior = celdas[k][j].name.style.backgroundColor.split("");
                    let r = colorAnterior[4] + colorAnterior[5]+colorAnterior[6];
                    let g = colorAnterior[9] + colorAnterior[10]+colorAnterior[11];
                    r = parseInt(r);
                    g = parseInt(g);
                    if(r < 0){
                        celdas[k][j].name.style.backgroundColor = 'rgb(' + r + ' ,' + g + ' ,' + 255 + ')'
                    }else{
                        r = r-intensidadMuerte;
                        g = g-intensidadMuerte; 
                        celdas[k][j].name.style.backgroundColor = 'rgb(' + r + ' ,' + g + ' ,' + 255 + ')';
                    }
                    
                }else{celdas[k][j].name.style.backgroundColor = colorDeCelda;}
                
            }
        }
    }
    textoGeneracion.textContent = 'Generación:' + ' ' + generacion;
}

/* Calcular el siguiente estado de las células */
function mOv(){
    for(let k = 0;k < f;k++){
        for(let j = 0;j<c;j++){
            celdas[k][j].estadoAnterior = celdas[k][j].estado; 
            for(let i = -1;i < 2;i++){
                for(let e = -1;e< 2;e++){
                    let x = k + i;
                    let y = j + e;
                    if(x<0){x=x+f}else if(x>f-1){x=x-f};
                    if(y<0){y=y+c}else if(y>c-1){y=y-c};
                        if(celdas[x][y] !== celdas[k][j]){
                            celdas[k][j].vecinos = celdas[k][j].vecinos + celdas[x][y].estado;
                        }
                }
            }
        }
    }
    /* Definir el estado de la célula para la siguiente ronda */
    for(let k = 0;k < f;k++){
        for(let j = 0;j<c;j++){
            if(celdas[k][j].estado == 0){
                if(celdas[k][j].vecinos == 3){
                    celdas[k][j].estado = 1;
                }else{
                    celdas[k][j].estado = 0;
                }
            }else{
                if((celdas[k][j].vecinos == 2)||(celdas[k][j].vecinos == 3)){
                    celdas[k][j].estado = 1;
                }else{
                    celdas[k][j].estado = 0;
                }
            }
            celdas[k][j].vecinos = 0;
        }
    }
}

/* Bucle del juego */
function bucle(){
    loop = setInterval(function(){generacion++;mOv();pintarCeldas();},tiempo);
}
/* Función de inicialización del juego */
function inicio(){
    crearTablero();
    pintarCeldas(); 
} 
/* Stop e inicio del juego con la barra espaciadora */
document.addEventListener('keydown', function(e){
    if(e.keyCode == 32){
        if(contadorParar == 1){
            clearInterval(loop); 
            contadorParar = 0;
        }else{
            bucle();
            contadorParar = 1;
        }
    }
});
document.getElementById('boton3').addEventListener('click', function(e){
        if(contadorParar == 1){
            clearInterval(loop); 
            contadorParar = 0;
        }else{
            bucle();
            contadorParar = 1;
        }
});

tablero.addEventListener('click',function(e){
    let elemento = e.target;
    let k = parseFloat(elemento.getAttribute('k'));
    let j = parseFloat(elemento.getAttribute('j'));
    barcoM(k,j);
})