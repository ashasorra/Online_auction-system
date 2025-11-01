import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
    msgLabel: {
        fontSize: 18,
        color: "blue"
    }
})

class DisplayBid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bidHistory: []
        }
    }

   render() {
    const { classes, bidHistory } = this.props;

    const mapped = bidHistory.map((bid) => {
        if (!bid.amount) return null;

        return (
            <React.Fragment key={bid._id}>
                <FormLabel className={classes.msgLabel}>
                    {bid.user.firstName}: &#8377; {bid.amount}
                </FormLabel>
                <br />
            </React.Fragment>
        );
    });

    return <>{mapped}</>;
   }
}

DisplayBid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DisplayBid);