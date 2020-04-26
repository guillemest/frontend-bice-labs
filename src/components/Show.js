import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { capitalizeFirstLetter } from './../utils/utils';

function Show(props) {
  let [chartJsConfig, setChartJsData] = useState();
  const [data, setData] = useState({});
  const [elementos, setDataElementos] = useState();
  const [opcionSeleccionada, setOpcionSeleccionada] = useState();
  const [elementoFecha, setElementoFecha] = useState();
  const [fechaSeleccionada, setFecha] = useState();
  const [showLoading, setShowLoading] = useState(true);
  const urlObtenerValoresPorElemento =
    'http://localhost:4000/api/v1/obtenerValoresPorElemento/';

  const urlObtenerElementos = 'http://localhost:4000/api/v1/obtenerElementos/';

  const urlObtenerValoresPorElementoFecha =
    'http://localhost:4000/api/v1/obtenerValoresPorElementoFecha';

  useEffect(() => {
    setFecha(new Date());
    obtenerValorElementoPorKey(props.match.params.id).then((d) => {
      setDataValues(d);

      const obtenerElementos = async () => {
        const reqElemData = await axios(urlObtenerElementos);
        setDataElementos(reqElemData.data);
        setShowLoading(false);
        return reqElemData;
      };
      obtenerElementos().then();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerValorElementoPorKey = async (elementoSeleccionado) => {
    const params = {
      key: elementoSeleccionado,
    };
    const datosElemento = await axios(urlObtenerValoresPorElemento, {
      params,
    });
    return datosElemento.data;
  };

  const setDataValues = (data) => {
    setData(data);
    setElementoFecha(null);
    setFecha(new Date());
    setOpcionSeleccionada(data.key);
    const chartJsLabels = Object.keys(data.values).map((key) => {
      return moment(key, 'x').format('DD');
    });

    const chartJsData = Object.keys(data.values).map((key) => {
      return data.values[key];
    });
    const values = {
      labels: chartJsLabels,
      datasets: [
        {
          label: `Precios ${data.key}`,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: chartJsData,
        },
      ],
    };
    setChartJsData(values);
  };

  const cambioElemento = (event) => {
    setShowLoading(true);
    obtenerValorElementoPorKey(event.target.value.toLowerCase()).then((d) => {
      setDataValues(d);
      setShowLoading(false);
    });
  };

  const cambioFecha = (date) => {
    setShowLoading(true);
    setFecha(date);
    const fechaSeleccionada = moment(date).format('DD-MM-YYYY');
    obtenerValoresPorElementoFecha(data.key, fechaSeleccionada).then((d) => {
      setShowLoading(false);
      setElementoFecha(d);
    });
  };

  const obtenerValoresPorElementoFecha = async (
    elementoSeleccionado,
    fecha
  ) => {
    const params = {
      key: elementoSeleccionado,
      date: fecha,
    };
    const datosElemento = await axios(urlObtenerValoresPorElementoFecha, {
      params,
    });
    return datosElemento.data;
  };

  return (
    <div className='container mt-5'>
      {showLoading && (
        <Spinner
          variant='primary'
          animation='border'
          className='spinner'
        ></Spinner>
      )}

      {!showLoading && (
        <div className='float-right mr-3'>
          <div>Seleccione fecha:</div>
          <DatePicker
            className='pointer'
            locale='es'
            dateFormat='dd-MM-yyy'
            selected={fechaSeleccionada}
            onChange={cambioFecha}
          />
        </div>
      )}

      {!showLoading && (
        <div className='float-right mr-3'>
          <div>Seleccione elemento:</div>
          <select
            style={{ width: '25vh' }}
            name='customSearch'
            className='custom-search-select'
            onChange={cambioElemento}
            value={opcionSeleccionada}
          >
            {elementos.map((element) => (
              <option key={element} value={element}>
                {capitalizeFirstLetter(element)}
              </option>
            ))}
          </select>
        </div>
      )}
      {!showLoading && !elementoFecha && (
        <div>
          <h1>{capitalizeFirstLetter(data.key)}</h1>
          <p>{data.name}.</p>
        </div>
      )}

      {!showLoading && elementoFecha && (
        <div className='col-lg-4 col-md-6 col-sm-12 mt-1'>
          <div className='card dashboardPanel'>
            <div className='card-body'>
              <h5 className='card-title'>{moment(fechaSeleccionada).format('DD-MM-YYYY')}</h5>
              {elementoFecha.name} : {elementoFecha.value}
            </div>
          </div>
        </div>
      )}

      {!showLoading && !elementoFecha && (
        <div className='mt-5'>
          <Line data={chartJsConfig} />
          <p></p>
        </div>
      )}
    </div>
  );
}

export default withRouter(Show);
