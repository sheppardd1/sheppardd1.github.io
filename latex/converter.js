
function generate() {
        //initial
        var table, i, numcols;
        table = '\0';
        numcols = 0;
        numcols_max = 0;
        var row = 0;
        var x = $('textarea[name=excel]').val();                    //x is the user's pasted input
        var caption = $('textarea[name=caption_input]').val();      //x is the user's pasted input
        var  label = $('textarea[name=label_input]').val();         //x is the user's pasted input
        var e = document.getElementById("select_alignment");        //get value from select box for alignment
        var align = e.options[e.selectedIndex].value;               //align is either r, c, or l
        e = document.getElementById("select_first_row");            //get value from select box for afirst row style
        var style_first_row= e.options[e.selectedIndex].value;      //align is either r, b, u, or i (regular, bold, underline, italics)
        e = document.getElementById("select_first_col");            //get value from select box for afirst row style
        var style_first_col= e.options[e.selectedIndex].value;      //align is either r, b, u, or i (regular, bold, underline, italics)
        e = document.getElementById("select_dividers");             //get value from select box for afirst row style
        var dividers = e.options[e.selectedIndex].value;            //align is either b, r, c, or n (both, rows only, cols only, or none)
        e = document.getElementById("select_slash");                //get value from select box for afirst row style
        var slash = e.options[e.selectedIndex].value;               //align is either b, r, c, or n (both, rows only, cols only, or none)

        if (x.charAt(0) != '') {    //ensure textarea is not empty first

            if (x.charAt(x.length - 1) != '\n') {   //fixes weird bug where input needed to end with endline or it would crash
                x += '\n';  //add endline to end if that is not hte last char in the input
            }

            //determine number of cols
            for (i = 0; i < x.length; ++i) {
                if (x.charAt(i) == '\t') {
                    numcols++;
                }
                else if (x.charAt(i) == '\n') {
                    numcols++;
                    if (numcols > numcols_max) {
                        numcols_max = numcols;
                    }
                    numcols = 0;
                }
            }

            table += "\\begin{table}[h]\n\\centering\n";    //start table

            // add caption and label
            if(caption.charAt(0) != ''){
                table += "\\caption{" + check_text(caption, slash) + "}\n";
            }else{
                table += "\\caption{}\n";
            }
            if (label.charAt(0) != '') {
                table += "\\label{" + check_text(label, slash) + "}\n"
            }else {
                table += "\\label{}\n";
            }

            //finish beginning of table
            table += "\\begin{tabular}{";
            if (dividers == 'c' || dividers == 'b') {
                table += '|';
            }

            //print the |c|c|c| part to specify number of cols in LaTeX
            for (j = 0; j < numcols_max; j++) {
                if (j < numcols_max - 1) {
                    table += align;
                    if (dividers == 'c' || dividers == 'b') {
                        table += '|';
                    }
                }
                else {
                    table += align;
                    if (dividers == 'c' || dividers == 'b') {
                        table += '|';
                    }
                    table += "}\n";
                    if (dividers == 'r' || dividers == 'b') {
                        table += "\\hline\n";
                    }
                }
            }

            x = check_text(x, slash);                   // account for special characters that are keywords in LaTeX or HTML

            var i = 0;                                  // index of x
            do {                                        //do conversion for each row until end of document
                var col = 0;                            // col is compared to the number of columns
                //do {                                  //do each row

                    if (row == 0 && style_first_row == 'b') {           //apply boldface to first row if user chooses styled first row
                        table += "\\textbf{";
                    }
                    else if (row == 0 && style_first_row == 'i') {     //apply italics to first row if user chooses styled first row
                        table += "\\textit{";
                    }
                    else if (row == 0 && style_first_row == 'u') {     //apply underline to first row if user chooses styled first row
                        table += "\\underline{";
                    }

                    if (style_first_col == 'b' && (style_first_row != style_first_col || row != 0)) {           //apply boldface to first col if user chooses styled first row
                        table += "\\textbf{";
                    }
                    else if (style_first_col == 'i' && (style_first_row != style_first_col || row != 0)) {      //apply italics to first col if user chooses styled first row
                        table += "\\textit{";
                    }
                    else if (style_first_col == 'u' && (style_first_row != style_first_col || row != 0)) {      //apply underline to first col if user chooses styled first row
                        table += "\\underline{";
                    }

                    while (x.charAt(i) != '\n') {       //read in input until end of the line
                        //if not tab, put char into table:
                        if (x.charAt(i) != '\t') {
                            table += x.charAt(i);
                        }
                        //if tab, add LaTeX col divider ("&") (and boldface if applicable)
                        else {
                            //if on first row && need to style row and col && row and col get different styles and on first col
                            if (row == 0 && style_first_col != 'r' && style_first_row != 'r' && (style_first_col != style_first_row) && col == 0) {
                                table += "}}";
                            // else if on first row or first col and it needs styling, add '}'
                            } else if ((row == 0 && style_first_row != 'r') || (col == 0 && style_first_col != 'r')) {
                                table += "}";
                            }

                            table += " & ";     //latex divider for columns

                            if (row == 0 && style_first_row== 'b') {
                                table += "\\textbf{";
                            }
                            else if (row == 0 && style_first_row== 'i') {     //apply boldface to first row if user chooses styled first row
                                table += "\\textit{";
                            }
                            else if (row == 0 && style_first_row== 'u') {     //apply boldface to first row if user chooses styled first row
                                table += "\\underline{";
                            }
                            col++; //increment col to read in each column
                        }
                        i++;
                    }   //end while not at end of row

                    if (row == 0 && style_first_row != 'r') {
                        table += "}";
                    }

                    if (col == 0 && style_first_col != 'r' && numcols_max == 1 && ((style_first_col != style_first_row) || row != 0)) {
                        table += "}";
                    }

                    while (col < numcols_max - 1) {
                        if (col == 0 && ((style_first_col != 'r' )|| (row == 0 && style_first_row != 'r'))) {   //if only 1st col has value and need to stylize, add ending '}'
                            table += "}";
                        }
                        table += " & ";
                        ++col;
                    }

                    //reached end of row, so add endline and hline
                    table += '\\' + '\\' + ' '
                    if (dividers == 'r' || dividers == 'b') {
                        table += '\\' + "hline";
                    }

                    table += "\n";  //new line for new row
                    i++;

                ++row;              // next row of data

            } while (i < x.length && x.charAt(i) != ''); //go until end of document

            table += "\\end{tabular}\n\\end{table}"; //finish ending of table

            output = table;

            document.getElementById("output").innerHTML = table;

        }       //end if textarea is not empty
        else {  //if textarea is empty, keep output empty
            document.getElementById("output").innerHTML = '';
        }

    }

function check_text(text, slash){  //account for LaTeX and HTML keywords
    var new_text = "";                  // new string
    var special_char = false;
    for(j = 0; j < text.length; j++){   // check each char in the inputted string
        if(text.charAt(j) == '\%' || text.charAt(j) == '$' || text.charAt(j) == '_' || text.charAt(j) == '\&' || text.charAt(j) == '#'){
            special_char = true;
        }else{
            special_char = false;
        }

        // if there is a special char and user wants it escaped, add a backslash
        if(special_char && slash == 'Y'){
            new_text += '\\';
        }

        // account for <, >, and ~. Then print out the char itself
        switch(text.charAt(j)){
            case '<':
                new_text += "$&lt;$";
                break;
            case '>':
                new_text += "$&gt;$";
                break;
            case '~':
                new_text += "\\sim";
                break;
            default:
                new_text += text.charAt(j);
        }




/*
        switch(text.charAt(j)){
            case '<':
                new_text += "$&lt;$";
                break;
            case '>':
                new_text += "$&gt;$";
                break;
                // if user has chosen to account for special LaTeX characters, put a '\' before them'
                // special characeters are : %, $, _, &, #
            case '&':
                if(slash == 'Y'){
                    new_text += "\\&";
                }else {
                    new_text += text.charAt(j);
                }
                break;
            case '%':
                if(slash == 'Y'){
                    new_text += "\\%";
                }else {
                    new_text += text.charAt(j);
                }
                break;
            case '$':
                if(slash == 'Y'){
                    new_text += "\\$";
                }else {
                    new_text += text.charAt(j);
                }
                break;
            case '$':
                if(slash == 'Y'){
                    new_text += "\\#";
                }else {
                    new_text += text.charAt(j);
                }
                break;
            case '\\':
                if(slash == 'Y'){
                    new_text += "\\\\";
                }else {
                    new_text += text.charAt(j);
                }
                break;
            default:                                // if not keyword, leave as is
                new_text += text.charAt(j);
        }*/
    }
    return new_text;
}
