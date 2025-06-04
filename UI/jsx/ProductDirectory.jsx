import React from 'react';

const API_URL = "http://localhost:4999/graphql";
const initialProducts = [
  { id: 1, firstName: "Amir", lastName: "Khan", age: 30, title: "Manager", department: "IT", employeeType: "FullTime", currentStatus: true },
  { id: 2, firstName: "Adam", lastName: "Smith", age: 25, title: "HR Business Partner", department: "HR", employeeType: "PartTime", currentStatus: true }
];

class ProductDirectory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: initialProducts,
      filteredProducts: initialEmployees,
      loading: false,
      error: null
    };
    this.createProduct = this.createproduct.bind(this);
    this.searchProducts = this.searchProducts.bind(this);
  }

  async loadProducts() {
    try {
      this.setState({ loading: true });
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query {
            getEmployees {
              id firstName lastName age title department 
              employeeType dateOfJoining currentStatus
            }
          }`
        })
      });

      const result = await response.json();
      
      if (result.errors) throw new Error(result.errors[0].message);
      
      this.setState({ 
        employees: result.data?.getEmployees || initialEmployees,
        filteredEmployees: result.data?.getEmployees || initialEmployees,
        loading: false
      });
    } catch (error) {
      this.setState({ 
        error: error.message,
        loading: false
      });
    }
  }

  componentDidMount() {
    this.loadEmployees();
  }

createEmployee = async (employee) => {
  try {
    // Add your GraphQL mutation here
    await this.loadEmployees(); // Refresh the list after creation
  } catch (error) {
    console.error("Error creating employee:", error);
  }
};

  searchEmployees(searchText) {
    const filtered = this.state.employees.filter(emp => 
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.title.toLowerCase().includes(searchText.toLowerCase())
    );
    this.setState({ filteredEmployees: filtered });
  }

  updateEmployee = async (updatedEmployee) => {
  try {
    const mutation = `mutation {
      updateEmployee(
        id: "${updatedEmployee.id}", 
        updates: {
          ${updatedEmployee.firstName ? `firstName: "${updatedEmployee.firstName}"` : ""}
          ${updatedEmployee.lastName ? `lastName: "${updatedEmployee.lastName}"` : ""}
          ${updatedEmployee.title ? `title: "${updatedEmployee.title}"` : ""}
          ${updatedEmployee.department ? `department: "${updatedEmployee.department}"` : ""}
          ${updatedEmployee.employeeType ? `employeeType: "${updatedEmployee.employeeType}"` : ""}
          ${updatedEmployee.currentStatus !== undefined ? `currentStatus: ${updatedEmployee.currentStatus}` : ""}
        }
      ) {
        id firstName lastName title department employeeType currentStatus
      }
    }`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    
    if (result.errors) throw new Error(result.errors[0].message);
    
    // Update local state
    this.setState(prevState => ({
      employees: prevState.employees.map(emp => 
        emp.id === updatedEmployee.id ? result.data.updateEmployee : emp
      ),
      filteredEmployees: prevState.filteredEmployees.map(emp => 
        emp.id === updatedEmployee.id ? result.data.updateEmployee : emp
      )
    }));
  } catch (error) {
    console.error("Error updating employee:", error);
    this.setState({ error: error.message });
  }
};

render() {
  return (
    <div className="employee-directory" style={{ padding: '20px' }}>
      <h1>Employee Management System</h1>
      <EmployeeSearch onSearch={this.searchEmployees} />
      {this.state.error && (
        <div style={{ color: 'red', margin: '10px 0' }}>{this.state.error}</div>
      )}
      {this.state.loading ? (
        <p>Loading employees...</p>
      ) : (
        <EmployeeTable 
          employees={this.state.filteredEmployees} 
          onUpdate={this.updateEmployee}
        />
      )}
      <EmployeeCreate createEmployee={this.createEmployee} />
    </div>
  );
}
}

export default ProductDirectory;