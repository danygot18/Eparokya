import React from 'react';
import GuestSideBar from '../GuestSideBar';
import MetaData from '../Layout/MetaData';

export const Sermons = () => {
  return (
    <div style={styles.container}>
      <MetaData title="Sermons" />
      <div style={styles.contentContainer}>
        <GuestSideBar />
        <div style={styles.mainContent}>
          <h1>Sermons</h1>
          <p>This is the sermons section.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  mainContent: {
    flex: 1,
    padding: '40px',
    backgroundColor: '#f9f9f9',
  },
};

export default Sermons;
