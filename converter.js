
function generate() {
        //initial
        var table, i, numcols;
        table = '\0';
        numcols = 0;
        numcols_max = 0;
        var row = 0;
        var x = $('textarea[name=excel]').val();    //x is the user's pasted input
        var e = document.getElementById("select_alignment");   //get value from select box for alignment
        var align = e.options[e.selectedIndex].value;   //align is either r, c, or l
        e = document.getElementById("select_first_row");   //get value from select box for afirst row style
        var style_first_row= e.options[e.selectedIndex].value;   //align is either r, b, u, or i (regular, bold, underline, italics)
        e = document.getElementById("select_first_col");   //get value from select box for afirst row style
        var style_first_col= e.options[e.selectedIndex].value;   //align is either r, b, u, or i (regular, bold, underline, italics)
        e = document.getElementById("select_dividers");   //get value from select box for afirst row style
        var dividers = e.options[e.selectedIndex].value;   //align is either b, r, c, or n (both, rows only, cols only, or none)

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

            table += "\\begin{table}[h]\n\\centering\n";
            table += "\\caption{}" + "\n\\label{}\n";
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

            var i = 0;                                  // index of x
            do {                                        //do conversion for each row until end of document
                var col = 0;                            // col is compared to the number of columns
                //do {                                    //do each row

                    if (row == 0 && style_first_row == 'b') {     //apply boldface to first row if user chooses styled first row
                        table += "\\textbf{ ";
                    }
                    else if (row == 0 && style_first_row == 'i') {     //apply italics to first row if user chooses styled first row
                        table += "\\textit{ ";
                    }
                    else if (row == 0 && style_first_row == 'u') {     //apply underline to first row if user chooses styled first row
                        table += "\\underline{ ";
                    }


                    if (style_first_col == 'b' && (style_first_row != style_first_col || row != 0)) {     //apply boldface to first col if user chooses styled first row
                        table += "\\textbf{ ";
                    }
                    else if (style_first_col == 'i' && (style_first_row != style_first_col || row != 0)) {     //apply italics to first col if user chooses styled first row
                        table += "\\textit{ ";
                    }
                    else if (style_first_col == 'u' && (style_first_row != style_first_col || row != 0)) {     //apply underline to first col if user chooses styled first row
                        table += "\\underline{ ";
                    }

                    while (x.charAt(i) != '\n') {       //read in input until end of the line
                        //if not tab or special character, put char into table:
                        if (x.charAt(i) != '\t' && x.charAt(i) != '<' && x.charAt(i) != '>' && x.charAt(i) != '&' && x.charAt(i) != '%') {
                            table += x.charAt(i);
                        }
                        // if character has a special function in LaTeX or HTML, prevent it from causing problems:
                        else if (x.charAt(i) == '<') {   //need to indirectly print out '<' and '>' to prevent XSS, etc.
                            table += "&lt;";
                        }
                        else if (x.charAt(i) == '>') {
                            table += "&gt;";
                        }
                        else if (x.charAt(i) == '&'){   // since'&' is a keyword in LaTeX, need to put a backslash in front of it it it appears in excel data
                            table += "\\\&";
                        }
                        else if (x.charAt(i) == '%'){   // since'%' is a keyword in LaTeX, need to put a backslash in front of it it it appears in excel data
                            table += "\\\%";
                        }
                        //if tab, add LaTeX col divider ("&") (and boldface if applicable)
                        else {
                            //if on first row && need to style row and col && row and col get different styles and on first col
                            if (row == 0 && style_first_col != 'r' && style_first_row != 'r' && (style_first_col != style_first_row) && col == 0) {
                                table += " } }";
                            // else if on first row or first col and it needs styling, add '}'
                            } else if ((row == 0 && style_first_row != 'r') || (col == 0 && style_first_col != 'r')) {
                                table += " }";
                            }

                            table += " & ";     //latex divider for columns

                            if (row == 0 && style_first_row== 'b') {
                                table += "\\textbf{ ";
                            }
                            else if (row == 0 && style_first_row== 'i') {     //apply boldface to first row if user chooses styled first row
                                table += "\\textit{ ";
                            }
                            else if (row == 0 && style_first_row== 'u') {     //apply boldface to first row if user chooses styled first row
                                table += "\\underline{ ";
                            }
                            col++; //increment col to read in each column
                        }
                        i++;
                    }   //end while not at end of row

                    if (row == 0 && style_first_row != 'r') {
                        table += " }";
                    }

                    if (col == 0 && style_first_col != 'r' && numcols_max == 1 && ((style_first_col != style_first_row) || row != 0)) {
                        table += " }";
                    }

                    while (col < numcols_max - 1) {
                        if (col == 0 && ((style_first_col != 'r' )|| (row == 0 && style_first_row != 'r'))) {   //if only 1st col has value and need to stylize, add ending '}'
                            table += " }";
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
