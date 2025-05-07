import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

const PowerBIEmbedComponent = ({ embedUrl, accessToken, embedId }) => {
  return (
    <PowerBIEmbed
      embedConfig={{
        type: 'report',
        id: embedId,
        embedUrl: embedUrl,
        accessToken: accessToken,
        tokenType: models.TokenType.Embed,
        settings: {
          panes: {
            filters: { expanded: false, visible: false },
          },
        },
      }}
      eventHandlers={
        new Map([
          ['loaded', () => console.log('Report loaded')],
          ['rendered', () => console.log('Report rendered')],
          ['error', (event) => console.error(event.detail)],
        ])
      }
      cssClassName="report-container"
      getEmbeddedComponent={(embeddedReport) => {
        window.report = embeddedReport;
      }}
    />
  );
};

export default PowerBIEmbedComponent;
