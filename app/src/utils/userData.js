export function formatCpf(cpf) {

    const formatedCpf = cpf.replace(/[^\d]/g, '');

    if (formatedCpf.length !== 11) {
        throw new Error('CPF inválido');
    }

    return formatedCpf;
}

export function verifyInputSearch(string, inputSearch) {
    for (let i = 0; i <= string.length - inputSearch.length; i++) {
      if (string.substr(i, inputSearch.length) === inputSearch) {
        return true;
      }
    }
    return false;
  }

  export function formatCep(cep) {
    var formattedCep = cep.replace(/[-_]/g, '');
    return formattedCep;
}