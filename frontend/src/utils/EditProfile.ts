export const formatGender = (gender: string) => {
    switch (gender) {
      case 'male': return 'Male'
      case 'female': return 'Female'
      case 'other': return 'Other'
      case 'prefer-not-to-say': return 'Prefer not to say'
      default: return 'Not specified'
    }
  }

  export const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified'
    
    try {
      const date = new Date(dateString)
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date for display:', error)
      return 'Invalid date'
    }
  }

  export const convertDateToString = (date: string) => {
    const month = date.split('/')[1];
    const year = date.split('/')[2];
    let monthInString : string;
    switch (month) {
        case "01":
            monthInString = "January";
            break;
        case "02":
            monthInString = "February";
            break;
        case "03":
            monthInString = "March";
            break;        
        case "04":
            monthInString = "April";
            break;
        case "05":
            monthInString = "May";
            break;
        case "06":
            monthInString = "June";
            break;
        case "07":
            monthInString = "July";
            break;
        case "08":
            monthInString = "August";
            break;        
        case "09":
            monthInString = "September";
            break;
        case "10":
            monthInString = "October";
            break;
        case "11":
            monthInString = "November";
            break;
        default:
            monthInString = "December";
    }
    return monthInString +" "+ year;
  }

