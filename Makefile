.PHONY: lines_all lines_no_style lines_no_style_template

lines_all:
	find . -name "*.vue" -print0 | xargs -0 cat | wc -l

lines_no_style:
	find . -name "*.vue" -print0 \
	  | xargs -0 awk '\
	    /<style/ { in_style=1 }\
	    /<\/style/ { in_style=0; next }\
	    !in_style { count++ }\
	    END { print count }'

lines_no_style_template:
	find . -name "*.vue" -print0 \
	  | xargs -0 awk '\
	    /<style/ { in_style=1 }\
	    /<\/style/ { in_style=0; next }\
	    /<template/ { in_template=1 }\
	    /<\/template/ { in_template=0; next }\
	    !in_style && !in_template { count++ }\
	    END { print count }'
