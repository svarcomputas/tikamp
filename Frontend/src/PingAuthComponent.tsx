
import React, { useEffect, useState } from 'react';
import TikampApi from './TikampApi.tsx';

const PingAuthComponent: React.FC = () => {
  const [pingResponse, setPingResponse] = useState<string>('');

  useEffect(() => {
    const api = new TikampApi();
    const pingApi = api.pingApi();
    pingApi
      .pingAuthGet()
      .then((response) => {
        console.log(response)
        setPingResponse(JSON.stringify(response)); 
      })
      .catch((error) => {
        console.error(error);
        setPingResponse(`Error: ${error.toString()}`);
      });
  }, []);

  return <p>{pingResponse}</p>;
};

export default PingAuthComponent;
