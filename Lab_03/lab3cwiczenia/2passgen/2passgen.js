document.getElementById("genBtn").addEventListener("click", function() {
  
    const minLen = parseInt(document.getElementById("minLen").value);
    const maxLen = parseInt(document.getElementById("maxLen").value);
    const includeUpper = document.getElementById("upperCase").checked;
    const includeSpecial = document.getElementById("specialChars").checked;

    if (isNaN(minLen) || isNaN(maxLen) || minLen < 1 || maxLen < minLen) {
        alert("Błędne wartości długości hasła!");
        return;
    }

    let chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeSpecial) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?/";

    const length = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;

    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    alert("Wygenerowane hasło:\n" + password);
});