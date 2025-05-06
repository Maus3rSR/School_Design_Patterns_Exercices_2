interface LoadApprobation {
  approve(loan: BankLoan): void;
}

type BankLoan = {
  amount: number;
};

// La banque qui contient la liste des approbateurs
class Bank implements LoadApprobation {
  private staffList: Staff[] = [];

  addStaff(staff: Staff): void {
    const lastStaff = this.staffList[this.staffList.length - 1];
    lastStaff && staff.assignSuperior(lastStaff);

    this.staffList.push(staff);
  }

  approve(loan: BankLoan): void {
    this.staffList[this.staffList.length - 1].approve(loan);
  }
}

abstract class Staff implements LoadApprobation {
  protected superior: Staff;

  approve(loan: BankLoan): void {
    if (loan.amount < 100000) {
      console.log("Employee approved the loan");
    } else {
      this.superior.approve(loan);
    }
  }

  assignSuperior(superior: Staff): void {
    this.superior = superior;
  }
}

class Employee extends Staff {
  approve(loan: BankLoan): void {
    if (loan.amount <= 100000) {
      console.log("Employee approved the loan");
    } else {
      this.superior.approve(loan);
    }
  }
}

class TeamLeader extends Staff {
  approve(loan: BankLoan): void {
    if (loan.amount <= 500000) {
      console.log("TeamLeader approved the loan");
    } else {
      this.superior.approve(loan);
    }
  }
}

class DepartmentManager extends Staff {
  approve(loan: BankLoan): void {
    if (loan.amount <= 1000000) {
      console.log("DepartmentManager approved the loan");
    } else {
      this.superior.approve(loan);
    }
  }
}

class FinancialDirector extends Staff {
  approve(loan: BankLoan): void {
    console.log("FinancialDirector approved the loan");
  }
}

// Code client
function main() {
  const bank = new Bank();

  bank.addStaff(new FinancialDirector());
  bank.addStaff(new DepartmentManager());
  bank.addStaff(new TeamLeader());
  bank.addStaff(new Employee());

  bank.approve({ amount: 100000 });
  bank.approve({ amount: 500000 });
  bank.approve({ amount: 1000000 });
  bank.approve({ amount: 10000000 });
}

main();
