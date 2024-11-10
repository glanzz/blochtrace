import { useState } from 'react'
import './App.css'
import { Typography, Button, Backdrop, CircularProgress, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { traceProgram } from './blochtrace';
import Arrow from './Arrow';




function App() {
  const [input, setInput] = useState("OPENQASM 2.0;\nimport \"qelib1.inc\";\nqreg q[2];\nh q[0];\ny q[1];\n");
  const [showLoader, setShowLoader] = useState(false);
  const [data, setData] = useState(false);
  
  const handleChange = e => {
    // console.log(c);
    setInput(e.target.value);
  }
  const handleReset = () => {
    setInput("");
  }

  const handleTrace = () => {
    setShowLoader(true);
    const edges = traceProgram(input);
    setData(edges);
  //   const scene = new THREE.Scene();
  //   const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  //   const renderer = new THREE.WebGLRenderer();
  //   renderer.setSize( window.innerWidth, window.innerHeight );
  //   for(let i=1; i<edges[0].length; i++) {
  //     const dir = new THREE.Vector3( edges[0][0], edges[0][1], edges[0][2] );
  //     //normalize the direction vector (convert to vector of length 1)
  //     dir.normalize();
  //     const prevEdge  = edges[0][i-1];
  //     const origin = new THREE.Vector3(prevEdge[0], prevEdge[1], prevEdge[2]);
  //     const length = 1;
  //     const hex = 0xFF0000;
  //     const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
  //     scene.add( arrowHelper );
  //   }
  // document.body.appendChild( renderer.domElement );
  // renderer.render( scene, camera );
    setShowLoader(false);
  }

  if (showLoader) {
    return (
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={showLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  

  return (
    <>
      <div>
        <ToastContainer/>
        <Typography variant="h1" color="primary">Bloch Trace</Typography>
        <Typography variant="p">
          Blochsphere(<a href="https://bloch.kherb.io/">https://bloch.kherb.io/</a>) allows you to visualize current state of the qubit. But, what if you wanted to visualize what happened to the qubit before reaching that state ?
          BlochTrace allows you to trace the path, which is snapshot of states the qubits followed in a given circuit. Each of qubits of the circuit are assumed to be in pure states.
          Each arrow in the trace represents snapshot of applying an operation on the qubit. 
          View the demo below, every operation starts with pointing in z direction, the sequence of numbers are added as label. <i>Use mouse to drag and move in 3D space</i>
        </Typography>

        <Typography my={"20px"}>Input Program</Typography>
        <textarea id="program" name="program" rows="10" cols="50" style={{width: "100%", maxWidth: "800px", maxHeight: "50%"}} value={input} onChange={handleChange}>
        </textarea>
        <Box mt="10px">
      <Button variant="contained" onClick={handleTrace}>Trace</Button>
      <Button onClick={handleReset}>Reset</Button>
      
      </Box>

      <br/>
      <br/>

      <Arrow data={data} />
      </div>
    </>
  )
}

export default App
