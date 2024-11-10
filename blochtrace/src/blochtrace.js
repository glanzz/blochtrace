import { toast } from 'react-toastify';
import QuantumCircuit from "quantum-circuit"
import { GATES, INPUT_TYPE } from './constants';

export const traceProgram = (programString, type=INPUT_TYPE.QASM.name) => {
  const CIRCUIT = new QuantumCircuit();
  switch(type) {
    case INPUT_TYPE.QASM.name: {
      CIRCUIT.importQASM(programString, function(errors) {
        if (errors.length) {
          errors.forEach(err => {
            toast(err.msg);
          });
          return;
        }
      });
      break;
    }
    default: {
      toast("Invalid input type");
      return;
    }


  }
  console.log(CIRCUIT);

  const edges = [];
  for(let i = 0; i<CIRCUIT.numQubits; i++) {
    edges[i] = [];
    edges[i][0] = [0,0,0]; // Origin
    edges[i][1] = [0,0,1];// |0> state on bloch sphere
  }

  CIRCUIT.gates.forEach((qubit, qubitIndex) => {
    qubit.forEach(gate => {
      const prevValue = edges[qubitIndex].at(-1);
      let value = [];
      if (gate) {
        switch(gate.name) {
          case GATES.h.name: {
            value = [prevValue[2], prevValue[1], prevValue[0]];
            break;
          }
          case GATES.y.name: {
            value = [-prevValue[0], prevValue[1], -prevValue[2]];
            break;
          }
          case GATES.x.name: {
            value = [prevValue[0], -prevValue[1], -prevValue[2]];
            break;
          }
          case GATES.i.name: {
            value = [...prevValue];
            break;
          }
          case GATES.z.name: {
            value = [-prevValue[0], -prevValue[1], prevValue[2]];
            break;
          }
          default: {
            // Handle 2 qubit using null or undefined
            break;
          }
        }
        console.log(gate.name);
        console.log(qubitIndex);
        console.log(value.length ? "Value adding": "Value not adding");
        if (value.length) {
          edges[qubitIndex].push([...value]);
        }
      }
    });
  });

  console.log("Before plots",JSON.stringify(edges));

  edges.forEach((qubit, qubitIndex) => {
    let plots = [];
    qubit.forEach((edge, index) => {
      if (index === 0) {
        plots.push([...edge]);
      } else {
        let pedge  = plots[index-1];
        plots[index] = [pedge[0] + edge[0],
          pedge[1] + edge[1],
          pedge[2] + edge[2]]
      }
      
    });
    edges[qubitIndex] = plots;
  });
  console.log("After plots",JSON.stringify(edges));
  return edges;


}
