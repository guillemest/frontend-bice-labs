import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { List } from 'react-bootstrap-icons';
import { withRouter } from 'react-router-dom';
import { capitalizeFirstLetter } from './../utils/utils';

function Listar(props) {
  const [data, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const urlObtenerUltimosValoresElementos = 'http://localhost:4000/api/v1/obtenerUltimosValoresElementos';

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(urlObtenerUltimosValoresElementos);
      setData(result.data);
      setShowLoading(false);
    };

    fetchData();
  }, []);

  const showDetail = (id) => {
    props.history.push({
      pathname: '/detalleElemento/' + id,
    });
  };

  return (
    <div>
      {showLoading && (
        <Spinner
          variant='primary'
          animation='border'
          className='spinner'
        ></Spinner>
      )}
      <div className='container mt-5'>
        {!showLoading && (
          <Table>
            <thead>
              <tr>
                <th>Elemento</th>
                <th>Descripción</th>
                <th>Moneda</th>
                <th>Valor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((element) => (
                <tr key={element.key}>
                  <td>{capitalizeFirstLetter(element.key)}</td>
                  <td>{element.name}</td>
                  <td>{capitalizeFirstLetter(element.unit)}</td>
                  <td>${element.value}</td>
                  <td
                    action='true'
                    onClick={() => {
                      showDetail(element.key);
                    }}
                  >
                    <OverlayTrigger
                      overlay={
                        <Tooltip id='tooltip-disabled'>
                          Ver detalle {element.key}
                        </Tooltip>
                      }
                    >
                      <span className='d-inline-block'>
                        <List className='pointer' />
                      </span>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default withRouter(Listar);
